FactoryBot.define do
  factory :user do
    email { "test@email.com" }
    password { "password" }
    auto_archive_enabled { false }
  end
end
