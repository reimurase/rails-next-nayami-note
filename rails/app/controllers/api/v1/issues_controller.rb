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
end
