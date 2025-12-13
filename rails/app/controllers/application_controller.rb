class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

    def render_unprocessable_entity(exception)
      record = exception.record
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end

    def render_not_found(_exception)
      render json: { error: "Not Found" }, status: :not_found
    end
end
