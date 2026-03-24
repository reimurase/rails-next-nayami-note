FactoryBot.define do
  factory :roadmap do
    association :user
    association :concern
    goal { "テストのゴール" }
    content { "テストのロードマップ" }
    archived_at { nil }
  end
end
