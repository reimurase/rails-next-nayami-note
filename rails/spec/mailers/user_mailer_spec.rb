# spec/mailers/user_mailer_spec.rb
require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "reset_password" do
    let(:user) { create(:user) }
    let(:token) { user.generate_reset_password_token }
    let(:mail) { UserMailer.reset_password(user, token) }

    it "宛先が正しいこと" do
      expect(mail.to).to eq([user.email])
    end

    it "件名が正しいこと" do
      expect(mail.subject).to eq("パスワードの再設定")
    end

    it "text本文にトークン付きのURLが含まれること" do
      text_part = mail.text_part.body.decoded
      expect(text_part).to include(token)
    end

    it "html本文にトークン付きのURLが含まれること" do
      html_part = mail.html_part.body.decoded
      expect(html_part).to include(token)
    end

    it "text本文にユーザーのemailが含まれること" do
      text_part = mail.text_part.body.decoded
      expect(text_part).to include(user.email)
    end
  end
end
