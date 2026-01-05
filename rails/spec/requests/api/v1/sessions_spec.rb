# spec/requests/api/v1/sessions_spec.rb
require "rails_helper"
RSpec.describe "Api::V1::Sessions", type: :request do
  let(:user) { create(:user) }
  describe "POST /api/v1/session" do
    context "認証情報が正しい場合" do
      it "200 を返す" do
        post "/api/v1/session", params: {
          session: { email: user.email, password: "password" },
        }

        expect(response).to have_http_status(:ok)
      end
    end

    context "認証情報が不正な場合" do
      it "401 を返す" do
        post "/api/v1/session", params: {
          session: { email: user.email, password: "wrong" },
        }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/session" do
    context "ログアウトする場合" do
      it "204 を返す" do
        post "/api/v1/session", params: {
          session: { email: user.email, password: "password" },
        }
        expect(response).to have_http_status(:ok)

        delete "/api/v1/session"
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
