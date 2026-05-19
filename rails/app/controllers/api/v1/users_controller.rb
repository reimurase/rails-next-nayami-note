class Api::V1::UsersController < ApplicationController
  skip_before_action :require_login, only: [:create]
  rate_limit to: 5, within: 10.minutes, only: :create,
             by: -> { request.remote_ip },
             store: Rails.cache,
             with: -> { render_rate_limited }

  def show
  end

  def create
    user = User.new(user_params)
    user.save!
    reset_session
    session[:user_id] = user.id
    session[:session_version] = user.session_version
    head :created
  end

  def destroy
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
