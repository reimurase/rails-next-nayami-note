class Api::V1::SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create]
  rate_limit to: 10, within: 3.minutes, only: :create

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

  def destroy
    reset_session
    head :no_content
  end

  private

    def session_params
      params.require(:session).permit(:email, :password)
    end
end
