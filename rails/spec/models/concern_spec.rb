# spec/models/concern_spec.rb
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

    context "trigger_event が255文字の場合" do
      it "valid であること" do
        concern = build(:concern, trigger_event: "a" * 255)
        expect(concern).to be_valid
      end
    end

    context "trigger_event が256文字の場合" do
      it "invalid であること" do
        concern = build(:concern, trigger_event: "a" * 256)
        expect(concern).not_to be_valid
      end
    end
  end
end
