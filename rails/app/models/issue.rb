class Issue < ApplicationRecord
  before_validation { self.title = "" if title.nil? }

  validates :title, length: { maximum: 120 }
  validates :content, presence: true, length: { maximum: 1000 }

  belongs_to :user
  belongs_to :concern
end
