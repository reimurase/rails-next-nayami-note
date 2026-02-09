class User < ApplicationRecord
  has_secure_password

  validates :email,
    format: { with: URI::MailTo::EMAIL_REGEXP },
    presence: true,
    uniqueness: true,
    length: { maximum: 255 } 

  has_many :concerns, dependent: :destroy
end
