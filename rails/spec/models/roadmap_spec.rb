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
end
