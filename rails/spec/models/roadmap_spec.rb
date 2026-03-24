# spec/models/roadmap_spec.rb
require "rails_helper"

RSpec.describe Roadmap, type: :model do
  describe "factory" do
    it "valid であること" do
      roadmap = build(:roadmap)
      expect(roadmap).to be_valid
    end
  end

  describe "validation" do
    context "content が空の場合" do
      it "invalid であること" do
        roadmap = build(:roadmap, content: "")
        expect(roadmap).not_to be_valid
      end
    end

    context "content が nil の場合" do
      it "invalid であること" do
        roadmap = build(:roadmap, content: nil)
        expect(roadmap).not_to be_valid
      end
    end

    context "content が1000文字の場合" do
      it "valid であること" do
        roadmap = build(:roadmap, content: "a" * 1000)
        expect(roadmap).to be_valid
      end
    end

    context "content が1001文字の場合" do
      it "invalid であること" do
        roadmap = build(:roadmap, content: "a" * 1001)
        expect(roadmap).not_to be_valid
      end
    end

    context "goal が空の場合" do
      it "valid であること" do
        roadmap = build(:roadmap, goal: "")
        expect(roadmap).to be_valid
      end
    end

    context "goal が nil の場合" do
      it "valid であり、空文字に正規化されること" do
        roadmap = build(:roadmap, goal: nil)

        expect(roadmap).to be_valid
        expect(roadmap.goal).to eq("")
      end
    end

    context "goal が120文字の場合" do
      it "validであること" do
        roadmap = build(:roadmap, goal: "a" * 120)
        expect(roadmap).to be_valid
      end
    end

    context "goal が121文字の場合" do
      it "invalid であること" do
        roadmap = build(:roadmap, goal: "a" * 121)
        expect(roadmap).not_to be_valid
      end
    end
  end

  describe "archive scopes and methods" do
    let(:user) { create(:user) }
    let(:active_concern) { create(:concern, user: user) }
    let(:archived_concern) { create(:concern, user: user) }

    describe ".active" do
      let!(:active_roadmap) { create(:roadmap, user: user, archived_at: nil, concern: active_concern) }
      let!(:archived_roadmap) { create(:roadmap, user: user, archived_at: Time.current, concern: archived_concern) }

      it "未アーカイブの roadmap のみを返すこと" do
        expect(Roadmap.active).to contain_exactly(active_roadmap)
      end
    end

    describe ".archived" do
      let!(:active_roadmap) { create(:roadmap, user: user, archived_at: nil, concern: active_concern) }
      let!(:archived_roadmap) { create(:roadmap, user: user, archived_at: Time.current, concern: archived_concern) }

      it "アーカイブ済みの roadmap のみを返すこと" do
        expect(Roadmap.archived).to contain_exactly(archived_roadmap)
      end
    end

    describe "#archive!" do
      let(:roadmap) { create(:roadmap, user: user, archived_at: nil, concern: active_concern) }

      it "archived_at に現在時刻が入ること" do
        expect { roadmap.archive! }.
          to change { roadmap.reload.archived_at }.
               from(nil)
      end
    end

    describe "#unarchive!" do
      let(:roadmap) { create(:roadmap, user: user, archived_at: Time.current, concern: archived_concern) }

      it "archived_at に nil が入ること" do
        expect { roadmap.unarchive! }.
          to change { roadmap.reload.archived_at }.
               to(nil)
      end
    end
  end
end
