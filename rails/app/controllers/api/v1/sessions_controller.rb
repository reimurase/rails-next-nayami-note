class Api::V1::SessionsController < ApplicationController
  DUMMY_DIGEST = BCrypt::Password.create("dummy", cost: BCrypt::Engine::DEFAULT_COST).freeze

  skip_before_action :require_login, only: [:create, :guest_login]
  rate_limit to: 10, within: 3.minutes, only: :create,
             by: -> { request.remote_ip },
             store: Rails.cache,
             with: -> { render_rate_limited }

  rate_limit to: 3, within: 5.minutes, only: :guest_login,
             by: -> { request.remote_ip },
             store: Rails.cache,
             with: -> { render_rate_limited }

  def create
    user = User.find_by(email: session_params[:email])

    authed =
      if user
        user.authenticate(session_params[:password])
      else
        BCrypt::Password.new(DUMMY_DIGEST).is_password?(session_params[:password].to_s)
        false
      end

    if authed
      reset_session
      session[:user_id] = user.id
      head :ok
    else
      render json: { error: { code: "invalid_credentials" } }, status: :unauthorized
    end
  end

  def guest_login
    user = User.create_guest
    reset_session
    session[:user_id] = user.id
    head :ok
  end

  def destroy
    reset_session
    head :no_content
  end

  private

    def session_params
      params.require(:session).permit(:email, :password)
    end
end
