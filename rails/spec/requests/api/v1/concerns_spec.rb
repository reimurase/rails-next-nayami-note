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

      it "レコードを1件作成し、200を返す" do
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

  describe "GET api/v1/concerns" do
    subject(:request_api) { get "/api/v1/concerns" }

    let!(:concerns) { create_list(:concern, 3) }

    before do
      request_api
    end

    it "200 OK が返ること" do
      expect(response).to have_http_status(:ok)
    end

    it "concerns が期待した件数返ること" do
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
    end

    it "各 concern の内容が正しいこと" do
      json = JSON.parse(response.body)

      expect(json[0]["content"]).to eq(concerns[0].content)
      expect(json[1]["content"]).to eq(concerns[1].content)
      expect(json[2]["content"]).to eq(concerns[2].content)
    end
  end
end
