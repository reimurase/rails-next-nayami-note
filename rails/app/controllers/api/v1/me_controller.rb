class Api::V1::MeController < ApplicationController
  def show
    render json: {
      id: current_user.id,
      email: current_user.email,
    }, status: :ok
  end
end
