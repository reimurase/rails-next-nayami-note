class Concern < ApplicationRecord
  validates :content, presence: true
  validates :trigger_event, length: { maximum: 255 }
end
