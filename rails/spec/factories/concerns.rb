FactoryBot.define do
  factory :concern do
    trigger_event { "テストのきっかけ" }
    content { "テスト用の悩み" }
  end
end
