class User < ApplicationRecord
  before_validation :downcase_email
  has_secure_password

  validates :email,
            format: { with: URI::MailTo::EMAIL_REGEXP },
            presence: true,
            uniqueness: true,
            length: { maximum: 255 }

  validates :password, presence: true, on: :create
  validates :password, length: { minimum: 8 }, allow_nil: true

  has_many :concerns, dependent: :destroy
  has_many :issues, dependent: :destroy
  has_many :roadmaps, dependent: :destroy

  # ゲストログイン用メソッド
  def self.create_guest
    User.create!(
      email: "guest_#{SecureRandom.hex(8)}@example.com",
      password: SecureRandom.hex(16),
      guest: true,
    )
  end

  # パスワードリセット用メソッド
  def generate_reset_password_token
    token = SecureRandom.urlsafe_base64
    self.reset_password_digest = Digest::SHA256.hexdigest(token)
    self.reset_password_sent_at = Time.current
    save!
    token
  end

  def reset_password_token_valid?(token)
    Digest::SHA256.hexdigest(token) == reset_password_digest
  end

  def reset_password_token_expired?
    reset_password_sent_at < 1.hour.ago
  end

  private

    def downcase_email
      self.email = email.to_s.downcase
    end
end
