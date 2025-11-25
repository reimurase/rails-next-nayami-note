class Concern < ApplicationRecord
  validates :content, presence: true
end
