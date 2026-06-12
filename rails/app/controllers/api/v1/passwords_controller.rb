class Api::V1::PasswordsController < ApplicationController
  skip_before_action :require_login, only: [:reset_request, :reset]

  rate_limit to: 5, within: 5.minutes, only: :reset_request,
             by: -> { request.remote_ip },
             store: Rails.cache,
             with: -> { render_rate_limited }

  rate_limit to: 4, within: 1.hour, only: :reset_request,
             by: -> { params[:email].to_s.strip.downcase },
             store: Rails.cache,
             with: -> { render_rate_limited }

  def reset_request
    normalized_email = params[:email].to_s.strip.downcase
    user = User.find_by(email: normalized_email)

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
