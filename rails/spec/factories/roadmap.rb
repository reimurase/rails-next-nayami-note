FactoryBot.define do
  factory :roadmap do
    association :user
    goal { "テストのゴール" }
    content { "テストのロードマップ" }
  end
end
