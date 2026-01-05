# spec/requests/api/v1/me_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Me", type: :request do
  describe "GET /api/v1/me" do
    it "未ログインの場合は 401 を返す" do
      get "/api/v1/me"
      expect(response).to have_http_status(:unauthorized)
    end

    it "ログイン後は 200 を返し、 id/email を返す" do
      user = create(:user)

      post "/api/v1/session", params: {
        session: { email: user.email, password: "password" },
      }
      expect(response).to have_http_status(:ok)

      get "/api/v1/me"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json["id"]).to eq(user.id)
      expect(json["email"]).to eq(user.email)
    end
  end
end
