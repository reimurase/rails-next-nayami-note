# spec/models/user_spec.rb
require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it "userが valid であること" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "emailが必須であること" do
      user = build(:user, email: "")
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it "emailが一意であること" do
      create(:user, email: "testA@email.com")
      duplicate_user = build(:user, email: "testA@email.com")
      expect(duplicate_user).not_to be_valid
      expect(duplicate_user.errors[:email]).to be_present
    end

    it "passwordが必須であること（作成時）" do
      user = build(:user, password: "")
      expect(user).not_to be_valid
      expect(user.errors[:password]).to be_present
    end

    it "正しいパスワードなら認証できる" do
      user = create(:user, password: "password")
      result = user.authenticate("password")
      expect(result).to eq(user)
    end

    it "間違ったパスワードなら authenticate できない" do
      user = create(:user, password: "password")
      result = user.authenticate("wrong")
      expect(result).to be false
    end
  end
end
