FactoryBot.define do
  factory :concern do
    association :user
    trigger_event { "テストのきっかけ" }
    content { "テスト用の悩み" }
  end
end
