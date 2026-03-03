class Roadmap < ApplicationRecord
  before_validation { self.goal = "" if goal.nil? }

  belongs_to :user
end
