class Api::V1::IssuesController < ApplicationController
  skip_before_action :require_login
  def index
    issues = Issue.all
    render json: issues
  end

  def show
    issue = Issue.find(params[:id])
    render json: issue
  end

  def create
    issue = Issue.new(issue_params)
    issue.save!
    render json: issue, status: :created
  end

  def update
    issue = Issue.find(params[:id])
    issue.update!(issue_params)
    render json: issue
  end

  def destroy
    issue = Issue.find(params[:id])
    issue.destroy!
    head :no_content
  end

  private

    def issue_params
      params.require(:issue).permit(:title, :content)
    end
end
