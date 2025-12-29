# spec/requests/api/v1/users_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  describe "POST api/v1/users" do
    subject(:request_api) { post "/api/v1/users", params: params }

    let(:valid_params) do
      {
        user: {
          email: "test@email.com",
          password: "password",
          password_confirmation: "password",
        },
      }
    end

    let(:invalid_params) do
      {
        user: {
          email: "", # バリデーションに引っかかる値
          password: "password",
          password_confirmation: "wrong",
        },
      }
    end

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "レコードを1件作成し、201を返す" do
        expect { request_api }.to change { User.count }.by(1)
        expect(response).to have_http_status(:created)
        expect(response.body).to be_blank
      end
    end

    context "パラメータが不正なとき" do
      let(:params) { invalid_params }

      it "レコードを作成せず、422を返す" do
        expect { request_api }.not_to change { User.count }
        expect(response).to have_http_status(:unprocessable_entity)

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end
  end
end
