# spec/requests/api/v1/me_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Me", type: :request do
  describe "GET /api/v1/me" do
    context "未ログインの場合" do
      it "401 を返す" do
        get "/api/v1/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログインしている場合" do
      it "200 を返し、 id/email を返す" do
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

    context "ログアウトする場合" do
      it "/me が 401 になる" do
        user = create(:user)

        # login
        post "/api/v1/session", params: {
          session: { email: user.email, password: "password" },
        }
        expect(response).to have_http_status(:ok)

        # logged in確認
        get "/api/v1/me"
        expect(response).to have_http_status(:ok)

        # logout
        delete "/api/v1/session"
        expect(response).to have_http_status(:no_content)

        # logout後の確認
        get "/api/v1/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
