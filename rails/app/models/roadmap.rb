class Roadmap < ApplicationRecord
  before_validation { self.goal = "" if goal.nil? }

  validates :goal, length: { maximum: 120 }
  validates :content, presence: true

  belongs_to :user
end
