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

    it "emailの最大文字数が255であること" do
      valid_user = build(:user, email: "#{"a" * 243}@example.com") # 255
      invalid_user = build(:user, email: "#{"a" * 244}@example.com") # 256

      expect(valid_user).to be_valid
      expect(invalid_user).not_to be_valid
    end

    it "有効なemailを受け付ける" do
      valid = [
        "user@example.com",             # 基本形
        "USER@example.com",             # 大文字
        "user.name+tag@example.co.jp",  # . と + と複数ドメイン
        "user_name@example-domain.com", # _ と -
      ]

      valid.each do |email|
        user = build(:user, email:)
        expect(user).to be_valid, "expected #{email} to be valid, but got: #{user.errors.full_messages}"
      end
    end

    it "無効なemailを拒否する" do
      invalid = [
        "userexample.com",    # @なし
        "user@",              # ドメインなし
        "@example.com",       # ローカルなし
        "user@-example.com",  # ラベル先頭がハイフン
        "user@example..com",  # ドット連続
      ]

      invalid.each do |email|
        user = build(:user, email:)
        expect(user).to be_invalid, "expected #{email} to be invalid"
        expect(user.errors[:email]).to be_present
      end
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
