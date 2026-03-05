class Api::V1::Concerns::RoadmapsController < ApplicationController
  before_action :set_concern

  def create
    if @concern.roadmap
      return render json: { errors: { roadmap: [{ code: "already_exists" }] } },
                    status: :unprocessable_content
    end

    roadmap = @concern.create_roadmap!(roadmap_params.merge(user: current_user))
    render json: roadmap, status: :created
  end

  def update
    roadmap = @concern.roadmap
    return head :not_found unless roadmap

    roadmap.update!(roadmap_params)
    render json: roadmap
  end

  def destroy
    roadmap = @concern.roadmap
    return head :not_found unless roadmap

    roadmap.destroy!
    head :no_content
  end

  private

    def set_concern
      @concern = current_user.concerns.find(params[:concern_id])
    end

    def roadmap_params
      params.require(:roadmap).permit(:goal, :content)
    end
end
