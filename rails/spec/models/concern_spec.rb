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
end
