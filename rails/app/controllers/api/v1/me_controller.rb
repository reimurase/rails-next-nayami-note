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
      # 自動アーカイブオフは auto_archive_at / updated_at のみを更新し、
      # これらに関わるバリデーション・コールバックは存在しないため update_all を使用する
      # rubocop:disable Rails/SkipsModelValidations
      current_user.concerns.active.where.not(auto_archive_at: nil).
        update_all(auto_archive_at: nil, updated_at: Time.current)
      # rubocop:enable Rails/SkipsModelValidations
    end

    render json: {
      id: current_user.id,
      email: current_user.email,
      auto_archive_enabled: current_user.auto_archive_enabled,
    }
  end
end
