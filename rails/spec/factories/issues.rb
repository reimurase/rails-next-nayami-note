FactoryBot.define do
  factory :issue do
    association :user
    title { "テストのタイトル" }
    content { "テストの問題" }
  end
end
