class Concern < ApplicationRecord
  before_validation { self.trigger_event = "" if trigger_event.nil? }

  validates :content, presence: true, length: { maximum: 1000 }
  validates :trigger_event, length: { maximum: 120 }
end
