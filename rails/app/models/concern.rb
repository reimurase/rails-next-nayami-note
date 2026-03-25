class Concern < ApplicationRecord
  before_validation { self.trigger_event = "" if trigger_event.nil? }

  validates :content, presence: true, length: { maximum: 1000 }
  validates :trigger_event, length: { maximum: 120 }

  belongs_to :user
  has_one :issue, dependent: :destroy
  has_one :roadmap, dependent: :destroy

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }

  AUTO_ARCHIVE_PERIOD = 7.days

  def archive!
    return if archived?

    update!(
      archived_at: Time.current,
      auto_archive_at: nil,
    )
  end

  def unarchive!
    return unless archived?

    update!(
      archived_at: nil,
      auto_archive_at: user.auto_archive_enabled? ? Time.current + AUTO_ARCHIVE_PERIOD : nil,
    )
  end

  def archived?
    archived_at.present?
  end
end
