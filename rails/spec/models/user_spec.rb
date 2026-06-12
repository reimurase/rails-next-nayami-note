# spec/models/user_spec.rb
require "rails_helper"

RSpec.describe User, type: :model do
  describe "factory" do
    it "userが valid であること" do
      user = build(:user)
      expect(user).to be_valid
    end
  end

  describe "before_validation" do
    it "emailが小文字に変換されること" do
      user = build(:user, email: "TeSt@eXamPLe.cOm")
      user.valid?
      expect(user.email).to eq("test@example.com")
    end
  end

  describe "email validations" do
    it "emailが必須であること" do
      user = build(:user, email: "")
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it "emailが一意であること" do
      create(:user, email: "testA@email.com")
      duplicate_user = build(:user, email: "testA@email.com")

      expect(duplicate_user).not_to be_valid
      expect(duplicate_user.errors.details[:email]).to include(hash_including(error: :taken))
    end

    it "emailの最大文字数が255であること" do
      valid_user = build(:user, email: "#{"a" * 243}@example.com") # 255
      invalid_user = build(:user, email: "#{"a" * 244}@example.com") # 256

      expect(valid_user).to be_valid
      expect(invalid_user).not_to be_valid
      expect(invalid_user.errors.details[:email]).to include(hash_including(error: :too_long))
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
        expect(user.errors.details[:email]).to include(hash_including(error: :invalid))
      end
    end
  end

  describe "password validations" do
    it "passwordが必須であること（作成時）" do
      user = build(:user, password: "")
      expect(user).not_to be_valid
      expect(user.errors[:password]).to be_present
    end

    it "空白のみのpasswordを拒否する" do
      user = build(:user, password: " ")
      expect(user).not_to be_valid
      expect(user.errors.details[:password]).to include(error: :blank)
    end

    it "passwordの最小文字数が8であること" do
      valid_user = build(:user, password: "a" * 8)
      invalid_user = build(:user, password: "a" * 7)

      expect(valid_user).to be_valid
      expect(invalid_user).not_to be_valid
      expect(invalid_user.errors.details[:password]).to include(hash_including(error: :too_short))
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

  describe "reset password" do
    let(:user) { create(:user) }

    describe "#generate_reset_password_token" do
      it "生のトークンを返すこと" do
        token = user.generate_reset_password_token
        expect(token).to be_present
      end

      it "reset_password_digestが保存されること" do
        expect {
          user.generate_reset_password_token
        }.to change { user.reload.reset_password_digest }.from(nil)
      end

      it "reset_password_sent_atが保存されること" do
        expect {
          user.generate_reset_password_token
        }.to change { user.reload.reset_password_sent_at }.from(nil)
      end

      it "生のトークンとdigestが対応していること" do
        token = user.generate_reset_password_token
        expect(Digest::SHA256.hexdigest(token)).to eq(user.reset_password_digest)
      end
    end

    describe "#reset_password_token_expired?" do
      it "1時間以内ならfalseを返すこと" do
        user.generate_reset_password_token
        expect(user.reset_password_token_expired?).to be false
      end

      it "1時間を超えたらtrueを返すこと" do
        user.generate_reset_password_token
        travel_to 61.minutes.from_now do
          expect(user.reset_password_token_expired?).to be true
        end
      end
    end

    describe ".create_guest" do
      it "guestユーザーが生成されること" do
        expect { User.create_guest }.to change { User.count }.by(1)
      end

      it "guest: trueで生成されること" do
        user = User.create_guest
        expect(user.guest).to be true
      end

      it "呼ぶたびに異なるemailで生成されること" do
        user1 = User.create_guest
        user2 = User.create_guest
        expect(user1.email).not_to eq(user2.email)
      end
    end

    describe "password reset invalidates sessions" do
      it "session_version が増えること" do
        user = create(:user, session_version: 0)

        expect {
          user.update!(password: "new_password")
          user.update!(session_version: user.session_version + 1)
        }.to change { user.reload.session_version }.from(0).to(1)
      end
    end
  end

  describe ".create_guest" do
    let(:user) { User.create_guest }

    it "concern が4件作られる" do
      expect(user.concerns.count).to eq(4)
    end

    it "1件が archived（ライブラリ行き）になっている" do
      expect(user.concerns.where.not(archived_at: nil).count).to eq(1)
    end

    it "issue が2件作られる" do
      expect(user.issues.count).to eq(2)
    end

    it "roadmap が1件作られる" do
      expect(user.roadmaps.count).to eq(1)
    end
  end
end
