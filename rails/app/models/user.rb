class User < ApplicationRecord
  before_validation :downcase_email
  has_secure_password

  validates :email,
            format: { with: URI::MailTo::EMAIL_REGEXP },
            presence: true,
            uniqueness: true,
            length: { maximum: 255 }

  has_many :concerns, dependent: :destroy

  private

    def downcase_email
      self.email = email.to_s.downcase
    end
end
