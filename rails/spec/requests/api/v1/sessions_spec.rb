require "rails_helper"
RSpec.describe "Api::V1::Sessions", type: :request do
  let(:user) { create(:user) }

  it "正しい認証情報なら 200 を返す" do
    post "/api/v1/session", params: {
      session: { email: user.email, password: "password" },
    }

    expect(response).to have_http_status(:ok)
  end

  it "不正な認証情報なら 401 を返す" do
    post "/api/v1/session", params: {
      session: { email: user.email, password: "wrong" },
    }

    expect(response).to have_http_status(:unauthorized)
  end
end
