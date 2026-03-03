class Api::V1::Concerns::IssuesController < ApplicationController
  before_action :set_concern

  def show
    issue = @concern.issue
    return head :not_found unless issue

    render json: issue
  end

  def create
    if @concern.issue
      return render json: { errors: { issue: [{ code: "already_exists" }] } },
                    status: :unprocessable_content
    end

    issue = @concern.create_issue!(issue_params.merge(user: current_user))
    render json: issue, status: :created
  end

  def update
    issue = @concern.issue
    return head :not_found unless issue

    issue.update!(issue_params)
    render json: issue
  end

  def destroy
    issue = @concern.issue
    return head :not_found unless issue

    issue.destroy!
    head :no_content
  end

  private

    def set_concern
      @concern = current_user.concerns.find(params[:concern_id])
    end

    def issue_params
      params.require(:issue).permit(:title, :content)
    end
end
