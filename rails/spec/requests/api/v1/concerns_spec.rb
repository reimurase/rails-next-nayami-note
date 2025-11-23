require "rails_helper"

RSpec.describe "Api::V1::Concerns", type: :request do
  describe "POST api/v1/concerns" do
    subject { post "/api/v1/concerns", params: params }

    let(:valid_params) do
      {
        concern: {
          content: "テストの悩み",
        },
      }
    end

    let(:invalid_params) do
      {
        concern: {
          content: "", # バリデーションに引っかかる値
        },
      }
    end

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "レコードを1件作成し、201を返す" do
        expect { subject }.to change { Concern.count }.by(1)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["content"]).to eq "テストの悩み"
      end
    end

    context "パラメータが不正なとき" do
      let(:params) { invalid_params }

      it "レコードを作成せず、422を返す" do
        expect { subject }.not_to change { Concern.count }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
