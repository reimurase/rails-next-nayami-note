class Issue < ApplicationRecord
  before_validation { self.title = "" if title.nil? }

  belongs_to :user
end
