class Api::V1::IssuesController < ApplicationController
  def index
    issues = current_user.issues.order(created_at: :desc, id: :desc)
    render json: issues
  end

  def show
    issue = current_user.issues.find(params[:id])
    render json: issue
  end

  def create
    issue = current_user.issues.new(issue_params)
    issue.save!
    render json: issue, status: :created
  end

  def update
    issue = current_user.issues.find(params[:id])
    issue.update!(issue_params)
    render json: issue
  end

  def destroy
    issue = current_user.issues.find(params[:id])
    issue.destroy!
    head :no_content
  end

  private

    def issue_params
      params.require(:issue).permit(:title, :content)
    end
end
