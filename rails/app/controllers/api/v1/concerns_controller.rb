class Api::V1::ConcernsController < ApplicationController
  def index
    now = Time.current
    # 自動アーカイブは archived_at / auto_archive_at のみを更新し、
    # これらに関わるバリデーション・コールバックは存在しないため update_all を使用する
    # rubocop:disable Rails/SkipsModelValidations
    current_user.concerns.auto_archivable.
      update_all(archived_at: now, auto_archive_at: nil, updated_at: now)
    # rubocop:enable Rails/SkipsModelValidations

    concerns = current_user.concerns.active.order(created_at: :desc, id: :desc)
    render json: concerns
  end

  def archived
    concerns = current_user.concerns.archived.order(archived_at: :desc)
    render json: concerns
  end

  def archive
    concern = current_user.concerns.find(params[:id])
    concern.archive!
    render json: concern, status: :ok
  end

  def unarchive
    concern = current_user.concerns.find(params[:id])
    concern.unarchive!
    render json: concern, status: :ok
  end

  def show
    concern = current_user.concerns.includes(:issue, :roadmap).find(params[:id])
    render json: {
      concern: concern,
      issue: concern.issue,     # なければ nil
      roadmap: concern.roadmap, # なければ nil
    }
  end

  def create
    concern = current_user.concerns.new(
      concern_params.merge(
        auto_archive_at: current_user.auto_archive_enabled? ? Time.current + Concern::AUTO_ARCHIVE_PERIOD : nil,
      ),
    )
    concern.save!
    render json: concern, status: :created
  end

  def update
    concern = current_user.concerns.find(params[:id])
    concern.update!(concern_params)
    render json: concern
  end

  def destroy
    concern = current_user.concerns.find(params[:id])
    concern.destroy!
    head :no_content
  end

  private

    def concern_params
      params.require(:concern).permit(:trigger_event, :content)
    end
end
