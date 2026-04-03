# spec/requests/api/v1/passwords_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Passwords", type: :request do
  describe "POST /api/v1/password/reset_request" do
    subject(:request_api) {
      post "/api/v1/password/reset_request",
           params: { email: email }.to_json,
           headers: json_headers
    }

    context "登録済みのメールアドレスの場合" do
      let!(:user) { create(:user) }

      let(:email) { user.email }

      it "200を返すこと" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "メールが送信されること" do
        perform_enqueued_jobs do
          request_api
        end
        expect(ActionMailer::Base.deliveries.count).to eq(1)
      end
    end

    context "未登録のメールアドレスの場合" do
      let(:email) { "notfound@example.com" }
      it "200を返すこと" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "メールが送信されないこと" do
        expect {
          request_api
        }.not_to change { ActionMailer::Base.deliveries.count }
      end
    end
  end

  describe "POST /api/v1/password/reset" do
    subject(:request_api) {
      post "/api/v1/password/reset",
           params: { token: token, password: "new_password" }.to_json,
           headers: json_headers
    }

    let!(:user) { create(:user) }
    let(:valid_token) { user.generate_reset_password_token }
    let(:invalid_token) { "invalid_token" }

    context "正しいトークンの場合" do
      let(:token) { valid_token }

      it "200を返すこと" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "パスワードが更新されること" do
        request_api
        expect(user.reload.authenticate("new_password")).to be_truthy
      end

      it "tokenが削除されること" do
        request_api
        expect(user.reload.reset_password_digest).to be_nil
      end
    end

    context "無効なトークンの場合" do
      let(:token) { invalid_token }

      it "422を返すこと" do
        request_api
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "期限切れのトークンの場合" do
      let(:token) { valid_token }

      it "422を返すこと" do
        token
        travel_to 61.minutes.from_now do
          request_api
          expect(response).to have_http_status(:unprocessable_content)
        end
      end
    end
  end
end
