# spec/requests/api/v1/concerns_spec.rb
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

    let(:json) { JSON.parse(response.body) }

    context "concernが0件の場合" do
      before do
        Concern.delete_all   # 明示的に0件にする
        request_api          # ここで初めてリクエスト
      end

      it "レコードが0件の場合でも空配列が返ること" do
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "concernが複数件の場合" do
      let!(:concerns) { create_list(:concern, 3) }

      before do
        request_api
      end

      it "200 OK が返ること" do
        expect(response).to have_http_status(:ok)
      end

      it "concerns が期待した件数返ること" do
        expect(json.length).to eq(3)
      end

      it "各 concern の内容が正しいこと" do
        json.each_with_index do |item, i|
          expect(item["content"]).to eq(concerns[i].content)
        end
      end
    end
  end

  describe "GET api/v1/concerns/[:id]" do
    subject(:request_api) { get "/api/v1/concerns/#{concern_id}" }

    context "指定したIDのconcernが存在する場合" do
      let!(:concern) { create(:concern) }
      let(:concern_id) { concern.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end
    end

    context "指定したIDのconcernが存在しない場合" do
      let(:concern_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
