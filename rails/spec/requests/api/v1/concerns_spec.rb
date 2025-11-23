require "rails_helper"

RSpec.describe "Api::V1::Concerns", type: :request do
  describe "POST api/v1/concerns" do
    let(:valid_params) do
      {
        concern: {
          content: "テストの悩み",
        },
      }
    end

    it "レコードを1件作成し、201を返す" do
      expect {
        post "/api/v1/concerns", params: valid_params
      }.to change { Concern.count }.by(1)

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["content"]).to eq "テストの悩み"
    end

    context "パラメータが不正なとき" do
      let(:invalid_params) do
        {
          concern: {
            content: "", # バリデーションに引っかかる値
          },
        }
      end

      it "レコードを作成せず、422を返す" do
        expect {
          post "/api/v1/concerns", params: invalid_params
        }.not_to change { Concern.count }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
    # subject { post(api_v1_concerns_path, headers: ) }
  end
end
