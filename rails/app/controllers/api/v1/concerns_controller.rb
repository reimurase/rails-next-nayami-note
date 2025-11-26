class Api::V1::ConcernsController < ApplicationController
  def index
    concerns = Concern.all
    render json: concerns
  end

  def show
  end

  def edit
  end

  def create
    concern = Concern.new(concern_params)
    concern.save!
    render json: concern
  end

  def update
  end

  def delete
  end

  private

    def concern_params
      params.require(:concern).permit(:content)
    end
end
