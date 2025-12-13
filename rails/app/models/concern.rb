class Concern < ApplicationRecord
  validates :content, presence: true, length: { maximum: 1000 }
  validates :trigger_event, length: { maximum: 255 }
end
