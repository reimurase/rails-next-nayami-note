class Api::V1::PasswordsController < ApplicationController
  skip_before_action :require_login, only: [:reset_request, :reset]

  def reset_request
    user = User.find_by(email: params[:email])

    if user
      token = user.generate_reset_password_token
      UserMailer.reset_password(user, token).deliver_later
    end

    render json: { message: "入力されたメールアドレスに再設定用のメールを送信しました。" }, status: :ok
  end

  def reset
    user = User.find_by(
      reset_password_digest: Digest::SHA256.hexdigest(params[:token]),
    )

    if user.nil?
      return render json: { message: "無効なトークンです" }, status: :unprocessable_content
    end

    if user.reset_password_token_expired?
      return render json: { message: "トークンの有効期限が切れています" }, status: :unprocessable_content
    end

    if user.update(password: params[:password], reset_password_digest: nil, reset_password_sent_at: nil)
      user.update!(session_version: user.session_version + 1)
      render json: { message: "パスワードを再設定しました" }, status: :ok
    else
      render json: { errors: user.errors }, status: :unprocessable_content
    end
  end
end
