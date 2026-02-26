class Api::V1::RoadmapsController < ApplicationController
  def index
    roadmaps = current_user.roadmaps.order(created_at: :desc, id: :desc)
    render json: roadmaps
  end

  def show
    roadmap = current_user.roadmaps.find(params[:id])
    render json: roadmap
  end

  def create
    roadmap = current_user.roadmaps.new(roadmap_params)
    roadmap.save!
    render json: roadmap, status: :created
  end

  def update
    roadmap = current_user.roadmaps.find(params[:id])
    roadmap.update!(roadmap_params)
    render json: roadmap
  end

  def destroy
    roadmap = current_user.roadmaps.find(params[:id])
    roadmap.destroy!
    head :no_content
  end

  private

    def roadmap_params
      params.require(:roadmap).permit(:goal, :content)
    end
end
