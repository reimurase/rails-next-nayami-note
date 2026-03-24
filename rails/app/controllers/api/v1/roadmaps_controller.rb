class Api::V1::RoadmapsController < ApplicationController
  def index
    roadmaps = current_user.roadmaps.active.order(created_at: :desc, id: :desc)
    render json: roadmaps
  end

  def archived
    roadmaps = current_user.roadmaps.archived.order(archived_at: :desc)
    render json: roadmaps
  end

  def archive
    roadmap = current_user.roadmaps.find(params[:id])
    roadmap.archive!
    render json: roadmap, status: :ok
  end

  def unarchive
    roadmap = current_user.roadmaps.find(params[:id])
    roadmap.unarchive!
    render json: roadmap, status: :ok
  end
end
