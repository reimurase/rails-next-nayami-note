class Roadmap < ApplicationRecord
  before_validation { self.goal = "" if goal.nil? }

  validates :goal, length: { maximum: 120 }
  validates :content, presence: true, length: { maximum: 1000 }

  belongs_to :user
end
