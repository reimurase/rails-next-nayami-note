class Roadmap < ApplicationRecord
  before_validation { self.goal = "" if goal.nil? }

  validates :goal, length: { maximum: 120 }

  belongs_to :user
end
