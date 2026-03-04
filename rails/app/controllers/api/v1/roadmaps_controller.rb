class Api::V1::RoadmapsController < ApplicationController
  def index
    roadmaps = current_user.roadmaps.order(created_at: :desc, id: :desc)
    render json: roadmaps
  end
end
