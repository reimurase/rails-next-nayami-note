require "rails_helper"

RSpec.describe Concern, type: :model do
  describe "validations" do
    context "content が正しい場合" do
      it "valid であること" do
        concern = build(:concern)
        expect(concern).to be_valid
      end
    end

    context "content が空の場合" do
      it "invalid であること" do
        concern = build(:concern, content: "")
        expect(concern).not_to be_valid
      end
    end
  end
end
