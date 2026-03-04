# spec/requests/api/v1/concerns/roadmaps_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Concerns::Roadmaps", type: :request do
  let(:user) { create(:user) }
  let(:concern) { create(:concern, user: user) }

  before { login_as(user) }

  describe "GET /api/v1/concerns/:concern_id/roadmap" do
    subject(:request_api) { get "/api/v1/concerns/#{concern.id}/roadmap" }

    context "roadmapが存在する場合" do
      let!(:roadmap) { create(:roadmap, user: user, concern: concern) }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        expect(json["id"]).to eq(roadmap.id)
      end
    end

    context "roadmapが存在しない場合" do
      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST api/v1/concerns/:concern_id/roadmap" do
    subject(:request_api) do
      post "/api/v1/concerns/#{concern.id}/roadmap",
           params: { roadmap: params }.to_json,
           headers: csrf_headers
    end

    let(:valid_params) { { goal: "テストのゴール", content: "テストのロードマップ" } }

    let(:invalid_params) { { content: "" } } # バリデーションに引っかかる値

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "レコードを1件作成し、201を返す" do
        expect { request_api }.to change { Roadmap.count }.by(1)
        expect(response).to have_http_status(:created)

        json = JSON.parse(response.body)
        expect(json["goal"]).to eq "テストのゴール"
        expect(json["content"]).to eq "テストのロードマップ"

        created = Roadmap.find(json["id"])
        expect(created.concern_id).to eq(concern.id)
        expect(created.user_id).to eq(user.id)
      end
    end

    context "パラメータが不正なとき" do
      let(:params) { invalid_params }

      it "レコードを作成せず、422を返す" do
        expect { request_api }.not_to change { Roadmap.count }
        expect(response).to have_http_status(:unprocessable_content)

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end

    context "すでにroadmapが存在する場合(1:1)" do
      let(:params) { valid_params }
      let!(:roadmap) { create(:roadmap, user: user, concern: concern) }

      it "作成できず、422を返す" do
        expect { request_api }.not_to change { Roadmap.count }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "PATCH api/v1/concerns/:concern_id/roadmap" do
    subject(:request_api) {
      patch "/api/v1/concerns/#{concern.id}/roadmap",
            params: { roadmap: params }.to_json,
            headers: csrf_headers
    }

    # 共通で使う JSON パース用ヘルパ
    let(:body) { JSON.parse(response.body) }

    context "有効なパラメータを送信した場合" do
      let!(:roadmap) { create(:roadmap, goal: "元のゴール", content: "元のロードマップ", user: user, concern: concern) }
      let(:params) do
        { goal: "更新後のゴール", content: "更新後のロードマップ" }
      end

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "内容が更新されること" do
        expect { request_api }.to change { roadmap.reload.goal }.from("元のゴール").to("更新後のゴール").
                                    and change { roadmap.reload.content }.from("元のロードマップ").to("更新後のロードマップ")
      end

      it "レスポンスに更新後のデータが含まれていること" do
        request_api

        expect(body["id"]).to eq(roadmap.id)
        expect(body["goal"]).to eq("更新後のゴール")
        expect(body["content"]).to eq("更新後のロードマップ")
      end
    end

    context "パラメータが不正な場合（例: content が空）" do
      let!(:roadmap) { create(:roadmap, user: user, concern: concern) }
      let(:params) { { content: "" } }

      it "422 Unprocessable Entity が返ること" do
        request_api
        expect(response).to have_http_status(:unprocessable_content)
      end

      it "データが更新されないこと" do
        before_value = roadmap.reload.content
        request_api
        expect(roadmap.reload.content).to eq(before_value)
      end
    end

    context "roadmapが存在しない場合" do
      let(:params) { { content: "更新後のロードマップ" } }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のroadmapを更新しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let(:other_concern) { create(:concern, user: other_user) }
      let!(:other_roadmap) { create(:roadmap, content: "他人のロードマップ", user: other_user, concern: other_concern) }

      let(:concern) { other_concern }
      let(:params) { { content: "不正に更新" } }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE api/v1/concerns/:concern_id/roadmap" do
    subject(:request_api) { delete "/api/v1/concerns/#{concern.id}/roadmap", headers: csrf_headers }

    context "roadmapが存在する場合" do
      let!(:roadmap) { create(:roadmap, user: user, concern: concern) }
      it "204 No Content が返ること" do
        request_api
        expect(response).to have_http_status(:no_content)
      end

      it "roadmapが削除されること" do
        expect { request_api }.to change { Roadmap.count }.by(-1)
      end
    end

    context "roadmapが存在しない場合" do
      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のroadmapを削除しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let(:other_concern) { create(:concern, user: other_user) }
      let!(:other_roadmap) { create(:roadmap, content: "他人のロードマップ", user: other_user, concern: other_concern) }

      let(:concern) { other_concern }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end

      it "他人のデータが削除されないこと" do
        expect { request_api }.not_to change { Roadmap.count }
      end
    end
  end
end
