FactoryBot.define do
  factory :issue do
    association :user
    title { "テストのタイトル" }
    content { "テスト用の問題" }
  end
end
