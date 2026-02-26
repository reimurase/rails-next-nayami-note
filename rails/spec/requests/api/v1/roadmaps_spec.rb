# spec/requests/api/v1/roadmaps_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Roadmaps", type: :request do
  let(:user) { create(:user) }

  before do
    login_as(user)
  end

  describe "POST api/v1/roadmaps" do
    subject(:request_api) {
      post "/api/v1/roadmaps",
           params: { roadmap: params }.to_json,
           headers: csrf_headers
    }

    let(:valid_params) do
      {
        goal: "テストのゴール",
        content: "テストのロードマップ",
      }
    end

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "レコードを1件作成し、201を返す" do
        expect { request_api }.to change { user.roadmaps.count }.by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["goal"]).to eq "テストのゴール"
        expect(json["content"]).to eq "テストのロードマップ"
      end
    end
  end

  describe "GET /api/v1/roadmaps" do
    subject(:request_api) { get "/api/v1/roadmaps" }

    let(:json) { JSON.parse(response.body) }

    context "roadmapが0件の場合" do
      before do
        request_api
      end

      it "空配列が返ること" do
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "roadmapが複数件の場合" do
      let!(:roadmaps) { create_list(:roadmap, 3, user: user) }

      before do
        request_api
      end

      it "200 OK が返ること" do
        expect(response).to have_http_status(:ok)
      end

      it "roadmaps が期待した件数返ること" do
        expect(json.length).to eq(3)
      end

      it "各 roadmap の内容が正しいこと" do
        expected = roadmaps.index_by(&:id)

        json.each do |item|
          record = expected.fetch(item["id"])

          expect(item["goal"]).to eq(record.goal)
          expect(item["content"]).to eq(record.content)
        end
      end
    end
  end

  describe "GET /api/v1/roadmaps/:id" do
    subject(:request_api) { get "/api/v1/roadmaps/#{roadmap_id}" }

    context "指定したIDのroadmapが存在する場合" do
      let!(:roadmap) { create(:roadmap, user: user) }
      let(:roadmap_id) { roadmap.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end
    end

    context "指定したIDのroadmapが存在しない場合" do
      let(:roadmap_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "PATCH api/v1/roadmaps/:id" do
    subject(:request_api) {
      patch "/api/v1/roadmaps/#{roadmap_id}",
            params: { roadmap: params }.to_json,
            headers: csrf_headers
    }

    let!(:roadmap) { create(:roadmap, goal: "元のゴール", content: "元のロードマップ", user: user) }
    let(:roadmap_id) { roadmap.id }

    # 共通で使う JSON パース用ヘルパ
    let(:body) { JSON.parse(response.body) }

    context "指定したIDのroadmapが存在し、有効なパラメータを送信した場合" do
      let(:params) do
        {
          goal: "更新後のゴール",
          content: "更新後のロードマップ",
        }
      end

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "指定したroadmapの内容が更新されること" do
        expect {
          request_api
        }.to change { roadmap.reload.goal }.from("元のゴール").to("更新後のゴール").
               and change { roadmap.reload.content }.from("元のロードマップ").to("更新後のロードマップ")
      end

      it "レスポンスに更新後のデータが含まれていること" do
        request_api

        expect(body["id"]).to eq(roadmap.id)
        expect(body["goal"]).to eq("更新後のゴール")
        expect(body["content"]).to eq("更新後のロードマップ")
      end
    end

    context "指定したIDのroadmapが存在しない場合" do
      let(:roadmap_id) { 999_999 } # 存在しないIDを想定
      let(:params) do
        {
          content: "更新後のロードマップ",
        }
      end

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のroadmapを更新しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_roadmap) { create(:roadmap, user: other_user, content: "他人のロードマップ") }
      let(:roadmap_id) { other_roadmap.id }

      let(:params) do
        {
          content: "不正に更新",
        }
      end

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE api/v1/roadmaps/:id" do
    subject(:request_api) { delete "/api/v1/roadmaps/#{roadmap_id}", headers: csrf_headers }

    let!(:roadmap) { create(:roadmap, user: user) }
    let(:roadmap_id) { roadmap.id }

    context "指定したIDのroadmapが存在する場合" do
      it "204 No Content が返ること" do
        request_api
        expect(response).to have_http_status(:no_content)
      end

      it "指定したroadmapが削除されること" do
        expect { request_api }.to change { user.roadmaps.count }.by(-1)
      end
    end

    context "指定したIDのroadmapが存在しない場合" do
      let(:roadmap_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のroadmapを削除しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_roadmap) { create(:roadmap, user: other_user) }
      let(:roadmap_id) { other_roadmap.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end

      it "他人のデータが削除されないこと" do
        expect {
          request_api
        }.not_to change { Roadmap.count }
      end
    end
  end
end
