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
    user = User.create!(
      email: "guest_#{SecureRandom.hex(8)}@example.com",
      password: SecureRandom.hex(16),
      guest: true,
    )
    create_guest_sample_data(user)
    user
  end

  # ゲストの初期サンプルデータを生成する内部メソッド
  def self.create_guest_sample_data(user)
    data = YAML.load_file(Rails.root.join("config/guest_sample_data.yml"))
    data["concerns"].each do |c|
      concern = user.concerns.create!(
        trigger_event: c["trigger_event"],
        content: c["content"],
        archived_at: c["archived"] ? 1.month.ago : nil,
      )
      user.issues.create!(concern: concern, **c["issue"].symbolize_keys) if c["issue"]
      user.roadmaps.create!(concern: concern, **c["roadmap"].symbolize_keys) if c["roadmap"]
    end
  end

  # パスワードリセット用メソッド
  def generate_reset_password_token
    token = SecureRandom.urlsafe_base64
    self.reset_password_digest = Digest::SHA256.hexdigest(token)
    self.reset_password_sent_at = Time.current
    save!
    token
  end

  def reset_password_token_expired?
    # true は期限切れ false は有効
    return true if reset_password_sent_at.nil?

    reset_password_sent_at < 1.hour.ago
  end

  private

    def downcase_email
      self.email = email.to_s.downcase
    end
end
