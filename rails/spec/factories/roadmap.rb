FactoryBot.define do
  factory :roadmap do
    association :user
    association :concern
    goal { "テストのゴール" }
    content { "テストのロードマップ" }
  end
end
