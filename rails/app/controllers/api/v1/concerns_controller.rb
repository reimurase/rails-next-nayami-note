class Api::V1::ConcernsController < ApplicationController
  def index
    concerns = current_user.concerns.active.order(created_at: :desc, id: :desc)
    render json: concerns
  end

  def archived
    concerns = current_user.concerns.archived.order(archived_at: :desc)
    render json: concerns
  end

  def archive
    concern = current_user.concerns.find(params[:id])
    concern.archive!
    render json: concern, status: :ok
  end

  def unarchive
    concern = current_user.concerns.find(params[:id])
    concern.unarchive!
    render json: concern, status: :ok
  end

  def show
    concern = current_user.concerns.includes(:issue, :roadmap).find(params[:id])
    render json: {
      concern: concern,
      issue: concern.issue,     # なければ nil
      roadmap: concern.roadmap, # なければ nil
    }
  end

  def create
    concern = current_user.concerns.new(concern_params)
    concern.save!
    render json: concern, status: :created
  end

  def update
    concern = current_user.concerns.find(params[:id])
    concern.update!(concern_params)
    render json: concern
  end

  def destroy
    concern = current_user.concerns.find(params[:id])
    concern.destroy!
    head :no_content
  end

  private

    def concern_params
      params.require(:concern).permit(:trigger_event, :content)
    end
end
