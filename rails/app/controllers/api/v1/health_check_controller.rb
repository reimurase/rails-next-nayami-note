class Api::V1::HealthCheckController < ApplicationController
  skip_before_action :require_login, only: [:index]
  def index
    render json: { message: "Success Health Check!" }, status: :ok
  end
end
