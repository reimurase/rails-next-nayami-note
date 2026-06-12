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

    head :ok
  end

  def reset
    user = User.find_by(
      reset_password_digest: Digest::SHA256.hexdigest(params[:token].to_s),
    )

    if user.nil?
      return render json: { error: { code: "invalid_token", message: "invalid_token" } }, status: :unprocessable_content
    end

    if user.reset_password_token_expired?
      return render json: { error: { code: "token_expired", message: "token_expired" } }, status: :unprocessable_content
    end

    user.update!(
      password: params[:password],
      reset_password_digest: nil,
      reset_password_sent_at: nil,
      session_version: user.session_version + 1,
    )
    head :ok
  end
end
