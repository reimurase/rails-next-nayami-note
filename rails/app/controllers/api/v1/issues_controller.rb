class Api::V1::IssuesController < ApplicationController
  def index
    issues = current_user.issues.active.order(created_at: :desc, id: :desc)
    render json: issues
  end

  def archived
    issues = current_user.issues.archived.order(archived_at: :desc)
    render json: issues
  end

  def archive
    issue = current_user.issues.find(params[:id])
    issue.archive!
    render json: issue, status: :ok
  end

  def unarchive
    issue = current_user.issues.find(params[:id])
    issue.unarchive!
    render json: issue, status: :ok
  end
end
