class Issue < ApplicationRecord
  before_validation { self.title = "" if title.nil? }

  validates :title, length: { maximum: 120 }

  belongs_to :user
end
