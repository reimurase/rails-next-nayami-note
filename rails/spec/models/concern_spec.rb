# spec/models/concern_spec.rb
require "rails_helper"

RSpec.describe Concern, type: :model do
  describe "factory" do
    it "concern が valid であること" do
      concern = build(:concern)
      expect(concern).to be_valid
    end
  end

  describe "validations" do
    context "content が空の場合" do
      it "invalid であること" do
        concern = build(:concern, content: "")
        expect(concern).not_to be_valid
      end
    end

    context "content が nil の場合" do
      it "invalid であること" do
        concern = build(:concern, content: nil)
        expect(concern).not_to be_valid
      end
    end

    context "content が1000文字の場合" do
      it "valid であること" do
        concern = build(:concern, content: "a" * 1000)
        expect(concern).to be_valid
      end
    end

    context "content が1001文字の場合" do
      it "invalid であること" do
        concern = build(:concern, content: "a" * 1001)
        expect(concern).not_to be_valid
      end
    end

    context "trigger_event が空の場合" do
      it "valid であること" do
        concern = build(:concern, trigger_event: "")
        expect(concern).to be_valid
      end
    end

    context "trigger_event が nil の場合" do
      it "valid であり、空文字に正規化されること" do
        concern = build(:concern, trigger_event: nil)

        expect(concern).to be_valid
        expect(concern.trigger_event).to eq("")
      end
    end

    context "trigger_event が120文字の場合" do
      it "valid であること" do
        concern = build(:concern, trigger_event: "a" * 120)
        expect(concern).to be_valid
      end
    end

    context "trigger_event が121文字の場合" do
      it "invalid であること" do
        concern = build(:concern, trigger_event: "a" * 121)
        expect(concern).not_to be_valid
      end
    end
  end

  describe "archive scopes and methods" do
    let(:user) { create(:user) }

    describe ".active" do
      let!(:active_concern) { create(:concern, user: user, archived_at: nil) }
      let!(:archived_concern) { create(:concern, user: user, archived_at: Time.current) }

      it "未アーカイブの concern のみを返すこと" do
        expect(user.concerns.active).to contain_exactly(active_concern)
      end
    end

    describe ".archived" do
      let!(:active_concern) { create(:concern, user: user, archived_at: nil) }
      let!(:archived_concern) { create(:concern, user: user, archived_at: Time.current) }

      it "アーカイブ済みの concern のみを返すこと" do
        expect(user.concerns.archived).to contain_exactly(archived_concern)
      end
    end

    describe "#archive!" do
      let(:concern) { create(:concern, user: user, archived_at: nil, auto_archive_at: Time.current + Concern::AUTO_ARCHIVE_PERIOD) }

      it "archived_at に現在時刻が入ること" do
        expect { concern.archive! }.
          to change { concern.reload.archived_at }.
               from(nil)
      end

      it "auto_archive_at に nil が入ること" do
        expect(concern.auto_archive_at).not_to be_nil

        concern.archive!
        expect(concern.reload.auto_archive_at).to be_nil
      end
    end

    describe "#unarchive!" do
      subject(:unarchive) { concern.unarchive! }

      let(:concern) { create(:concern, user: user, archived_at: Time.current) }

      it "archived_at に nil が入ること" do
        expect { unarchive }.
          to change { concern.reload.archived_at }.
               to(nil)
      end

      context "user.auto_archive_enabled が true の場合" do
        let(:user) { create(:user, auto_archive_enabled: true) }
        let(:concern) { create(:concern, user: user, archived_at: Time.current, auto_archive_at: nil) }

        it "auto_archive_at に予約時刻が入ること" do
          unarchive
          expect(concern.reload.auto_archive_at).to be_present
        end
      end

      context "user.auto_archive_enabled が false の場合" do
        let(:user) { create(:user, auto_archive_enabled: false) }
        let(:concern) { create(:concern, user: user, archived_at: Time.current, auto_archive_at: nil) }

        it "auto_archive_at に nil が入ること" do
          unarchive
          expect(concern.reload.auto_archive_at).to be_nil
        end
      end
    end
  end
end
