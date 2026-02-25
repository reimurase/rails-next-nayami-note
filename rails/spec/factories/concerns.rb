FactoryBot.define do
  factory :concern do
    association :user
    trigger_event { "テストのきっかけ" }
    content { "テストのなやみ" }
  end
end
