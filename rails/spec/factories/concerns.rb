FactoryBot.define do
  factory :concern do
    association :user
    trigger_event { "テストのきっかけ" }
    content { "テストのなやみ" }
    archived_at { nil }
  end
end
