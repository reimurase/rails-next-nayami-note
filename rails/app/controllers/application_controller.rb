class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordNotDestroyed, with: :render_unprocessable_entity

  before_action :require_login

  private

    def render_unprocessable_entity(exception)
      record = exception.record
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end

    def render_not_found(_exception)
      render json: { error: "Not Found" }, status: :not_found
    end

    def current_user
      return @current_user if defined?(@current_user)

      user_id = session[:user_id]
      @current_user = user_id && User.find_by(id: user_id)
    end

    def require_login
      return if current_user

      render json: { error: "Unauthorized" }, status: :unauthorized
    end
end
