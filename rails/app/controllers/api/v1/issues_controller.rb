class Api::V1::IssuesController < ApplicationController
  def index
    issues = current_user.issues.order(created_at: :desc, id: :desc)
    render json: issues
  end
end
