class Api::V1::MeController < ApplicationController
  def show
    response.headers["Cache-Control"] = "no-store"
    render json: {
      id: current_user.id,
      email: current_user.email,
      auto_archive_enabled: current_user.auto_archive_enabled,
    }, status: :ok
  end

  def update_auto_archive
    enabled = ActiveModel::Type::Boolean.new.cast(params[:auto_archive_enabled])

    current_user.update!(auto_archive_enabled: enabled)

    if enabled == false
      current_user.concerns.active.where.not(auto_archive_at: nil).find_each do |concern|
        concern.update!(auto_archive_at: nil)
      end
    end

    render json: {
      id: current_user.id,
      email: current_user.email,
      auto_archive_enabled: current_user.auto_archive_enabled,
    }
  end
end
