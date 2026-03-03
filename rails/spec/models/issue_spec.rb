# spec/models/issue_spec.rb
require "rails_helper"

RSpec.describe Issue, type: :model do
  describe "factory" do
    it "valid であること" do
      issue = build(:issue)
      expect(issue).to be_valid
    end
  end

  describe "validation" do
    context "content が空の場合" do
      it "invalid であること" do
        issue = build(:issue, content: "")
        expect(issue).not_to be_valid
      end
    end

    context "content が nil の場合" do
      it "invalid であること" do
        issue = build(:issue, content: nil)
        expect(issue).not_to be_valid
      end
    end

    context "content が1000文字の場合" do
      it "valid であること" do
        issue = build(:issue, content: "a" * 1000)
        expect(issue).to be_valid
      end
    end

    context "content が1001文字の場合" do
      it "invalid であること" do
        issue = build(:issue, content: "a" * 1001)
        expect(issue).not_to be_valid
      end
    end

    context "title が空の場合" do
      it "valid であること" do
        issue = build(:issue, title: "")
        expect(issue).to be_valid
      end
    end

    context "title が nil の場合" do
      it "valid であり、空文字に正規化されること" do
        issue = build(:issue, title: nil)

        expect(issue).to be_valid
        expect(issue.title).to eq("")
      end
    end

    context "title が120文字の場合" do
      it "validであること" do
        issue = build(:issue, title: "a" * 120)
        expect(issue).to be_valid
      end
    end

    context "title が121文字の場合" do
      it "invalid であること" do
        issue = build(:issue, title: "a" * 121)
        expect(issue).not_to be_valid
      end
    end
  end
end
