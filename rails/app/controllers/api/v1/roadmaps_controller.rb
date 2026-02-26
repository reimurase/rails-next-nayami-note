class Api::V1::RoadmapsController < ApplicationController
  def index
    roadmaps = current_user.roadmaps.order(created_at: :desc, id: :desc)
    render json: roadmaps
  end

  def show
    roadmap = current_user.roadmaps.find(params[:id])
    render json: roadmap
  end
end
