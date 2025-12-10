class Api::V1::ConcernsController < ApplicationController
  def index
    concerns = Concern.all
    render json: concerns
  end

  def show
    concern = Concern.find(params[:id])
    render json: concern
  end

  def create
    concern = Concern.new(concern_params)
    concern.save!
    render json: concern
  end

  def update
    concern = Concern.find(params[:id])
    concern.update!(concern_params)
    render json: concern
  end

  def destroy
    concern = Concern.find(params[:id])
    concern.destroy!
    head :no_content
  end

  private

    def concern_params
      params.require(:concern).permit(:trigger_event, :content)
    end
end
