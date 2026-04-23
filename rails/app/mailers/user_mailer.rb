class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.reset_password.subject
  #
  def reset_password(user, token)
    @user = user
    @token = token
    @front_url = ENV["FRONT_URL"] || "https://localhost:3001"
    mail(to: @user.email, subject: "パスワードの再設定")
  end
end
