class Api::V1::SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create, :guest_login]
  rate_limit to: 10, within: 3.minutes, only: :create,
             by: -> { request.remote_ip },
             store: Rails.cache,
             with: -> { render_rate_limited }

  def create
    user = User.find_by(email: session_params[:email])

    if user&.authenticate(session_params[:password])
      reset_session
      session[:user_id] = user.id
      head :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def guest_login
    user = User.create_guest
    reset_session
    session[:user_id] = user.id
    render head: :ok
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
