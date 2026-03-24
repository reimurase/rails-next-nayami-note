class Roadmap < ApplicationRecord
  before_validation { self.goal = "" if goal.nil? }

  validates :goal, length: { maximum: 120 }
  validates :content, presence: true, length: { maximum: 1000 }

  belongs_to :user
  belongs_to :concern

  scope :active, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }

  def archive!
    return if archived?

    update!(archived_at: Time.current)
  end

  def unarchive!
    return unless archived?

    update!(archived_at: nil)
  end

  def archived?
    archived_at.present?
  end
end
