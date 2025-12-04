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

  describe "GET api/v1/concerns/:id" do
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

  describe "PATCH api/v1/concerns/:id" do
    subject(:request_api) { patch "/api/v1/concerns/#{concern_id}", params: params }

    let!(:concern) { create(:concern, content: "元の内容") }
    let(:concern_id) { concern.id }

    # 共通で使う JSON パース用ヘルパ（既に定義済なら不要）
    let(:body) { JSON.parse(response.body) }

    context "指定したIDのconcernが存在し、有効なパラメータを送信した場合" do
      let(:params) do
        {
          concern: {
            content: "更新後の内容",
          },
        }
      end

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "指定したconcernの内容が更新されること" do
        expect {
          request_api
        }.to change { concern.reload.content }.from("元の内容").to("更新後の内容")
      end

      it "レスポンスに更新後のデータが含まれていること" do
        request_api

        expect(body["id"]).to eq(concern.id)
        expect(body["content"]).to eq("更新後の内容")
      end
    end

    # context "指定したIDのconcernが存在しない場合" do
    #   let(:concern_id) { 999_999 } # 存在しないIDを想定
    #   let(:params) do
    #     {
    #       concern: {
    #         content: "更新後の内容"
    #       }
    #     }
    #   end

    #   it "404 Not Found が返ること" do
    #     request_api
    #     expect(response).to have_http_status(:not_found)
    #   end
    # end

    # context "パラメータが不正な場合（例: content が空）" do
    #   let(:params) do
    #     {
    #       concern: {
    #         content: ""
    #       }
    #     }
    #   end

    #   it "422 Unprocessable Entity が返ること" do
    #     request_api
    #     expect(response).to have_http_status(:unprocessable_entity)
    #   end

    #   it "データが更新されないこと" do
    #     expect {
    #       request_api
    #     }.not_to change { concern.reload.content }
    #   end
    # end
  end

  describe "DELETE api/v1/concerns/:id" do
    subject(:request_api) { delete "/api/v1/concerns/#{concern_id}" }

    let!(:concern) { create(:concern) }
    let(:concern_id) { concern.id }

    context "指定したIDのconcernが存在する場合" do
      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:no_content)
      end

      it "指定したconcernが削除されること" do
        expect { request_api }.to change { Concern.count }.by(-1)
      end
    end
    # 異常系はCRUDの強化の段階で導入予定
  end
end
