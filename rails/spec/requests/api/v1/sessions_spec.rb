# spec/requests/api/v1/sessions_spec.rb
require "rails_helper"
RSpec.describe "Api::V1::Sessions", type: :request do
  let(:user) { create(:user) }
  describe "POST /api/v1/session" do
    context "認証情報が正しい場合" do
      it "200 を返す" do
        post "/api/v1/session",
             params: {
               session: { email: user.email, password: user.password },
             }.to_json,
             headers: csrf_headers

        expect(response).to have_http_status(:ok)
      end
    end

    context "email の文字の大きさが違う場合" do
      it "200 を返す" do
        post "/api/v1/session",
             params: {
               session: { email: "TEST@Email.COM", password: user.password },
             }.to_json,
             headers: csrf_headers

        expect(response).to have_http_status(:ok)
        expect(response.body).to be_empty
      end
    end

    context "email の前後に空白がある場合" do
      it "200 を返す" do
        post "/api/v1/session",
             params: {
               session: { email: " test@email.com ", password: user.password },
             }.to_json,
             headers: csrf_headers

        expect(response).to have_http_status(:ok)
        expect(response.body).to be_empty
      end
    end

    context "認証情報が不正な場合" do
      it "401 を返す" do
        post "/api/v1/session",
             params: {
               session: { email: user.email, password: "wrong" },
             }.to_json,
             headers: csrf_headers

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body.dig("error", "code")).to eq("invalid_credentials")
      end
    end
  end

  describe "DELETE /api/v1/session" do
    context "ログアウトする場合" do
      it "204 を返す" do
        login_as(user)
        expect(response).to have_http_status(:ok)

        delete "/api/v1/session", headers: csrf_headers
        expect(response).to have_http_status(:no_content)
      end
    end
  end

  describe "POST /api/v1/guest_login" do
    subject(:request_api) {
      post "/api/v1/guest_login", headers: csrf_headers
    }

    it "200を返す" do
      request_api
      expect(response).to have_http_status(:ok)
      expect(response.body).to be_empty
    end

    it "guestユーザーが生成されること" do
      expect {
        request_api
      }.to change { User.count }.by(1)
    end

    it "呼ぶたびに別のguestユーザーが生成されること" do
      post "/api/v1/guest_login", headers: csrf_headers
      post "/api/v1/guest_login", headers: csrf_headers

      expect(User.where(guest: true).count).to eq(2)
    end
  end
end
