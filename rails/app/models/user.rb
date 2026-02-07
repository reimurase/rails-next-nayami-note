class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true, length: { maximum: 255 }

  has_many :concerns, dependent: :destroy
end
