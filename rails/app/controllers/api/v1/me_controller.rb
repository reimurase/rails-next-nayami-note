class Api::V1::MeController < ApplicationController
  def show
    response.headers["Cache-Control"] = "no-store"
    render json: {
      id: current_user.id,
      email: current_user.email,
    }, status: :ok
  end
end
