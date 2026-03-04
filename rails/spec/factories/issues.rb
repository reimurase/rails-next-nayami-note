FactoryBot.define do
  factory :issue do
    association :user
    association :concern
    title { "テストのタイトル" }
    content { "テストの問題" }
  end
end
