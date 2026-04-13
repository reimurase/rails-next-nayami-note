class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :exception

  rescue_from ActionController::InvalidAuthenticityToken, with: :render_invalid_csrf
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordNotDestroyed, with: :render_unprocessable_entity

  before_action :require_login

  private

    def render_rate_limited
      render json: { error: { code: "rate_limited", message: "Too many requests" } }, status: :too_many_requests
    end

    def render_invalid_csrf(_exception)
      Rails.logger.warn("[CSRF] invalid authenticity token")
      render json: { error: { code: "invalid_csrf", message: "CSRF token is invalid" } }, status: :forbidden
    end

    def render_unprocessable_entity(exception)
      record = exception.record

      errors = record.errors.details.transform_values do |arr|
        arr.map do |h|
          code = h[:error].to_s
          meta = {}
          meta[:max] = h[:count] if code == "too_long"
          meta[:min] = h[:count] if code == "too_short"
          meta = nil if meta.empty?
          meta ? { code: code, meta: meta } : { code: code }
        end
      end

      render json: { errors: errors }, status: :unprocessable_content
    end

    def render_not_found(_exception)
      render json: { error: { code: "not_found", message: "Not Found" } }, status: :not_found
    end

    def current_user
      return @current_user if defined?(@current_user)

      user_id = session[:user_id]
      @current_user = user_id && User.find_by(id: user_id)
    end

    def require_login
      return if current_user

      render json: { error: { code: "unauthorized", message: "Unauthorized" } }, status: :unauthorized
    end
end
