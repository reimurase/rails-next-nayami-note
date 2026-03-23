# spec/requests/api/v1/concerns_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Concerns", type: :request do
  let(:user) { create(:user) }

  before do
    login_as(user)
  end

  describe "POST /api/v1/concerns" do
    subject(:request_api) {
      post "/api/v1/concerns",
           params: { concern: params }.to_json,
           headers: csrf_headers
    }

    let(:valid_params) do
      {
        trigger_event: "テストのきっかけ",
        content: "テストの悩み",
      }
    end

    let(:invalid_params) do
      {
        content: "", # バリデーションに引っかかる値
      }
    end

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "current_user に紐づく concern を1件作成し、201を返す" do
        expect { request_api }.to change { user.concerns.count }.by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["trigger_event"]).to eq "テストのきっかけ"
        expect(json["content"]).to eq "テストの悩み"

        created_concern = user.concerns.order(:id).last
        expect(created_concern.user_id).to eq(user.id)
      end
    end

    context "パラメータが不正なとき" do
      let(:params) { invalid_params }

      it "レコードを作成せず、422を返す" do
        expect { request_api }.not_to change { user.concerns.count }
        expect(response).to have_http_status(:unprocessable_content)

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end
  end

  describe "GET /api/v1/concerns" do
    subject(:request_api) { get "/api/v1/concerns" }

    let(:json) { JSON.parse(response.body) }

    it "未アーカイブのみ返ること" do
      active_concern = create(:concern, user: user, archived_at: nil)
      create(:concern, user: user, archived_at: Time.current)

      request_api

      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(1)
      expect(json[0]["id"]).to eq(active_concern.id)
      expect(json[0]["archived_at"]).to be_nil
    end

    context "concernが0件の場合" do
      before do
        request_api
      end

      it "空配列が返ること" do
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "concernが複数件の場合" do
      let!(:concerns) { create_list(:concern, 3, user: user) }

      before do
        request_api
      end

      it "200 OK が返ること" do
        expect(response).to have_http_status(:ok)
      end

      it "自分の concerns のみが期待した件数返ること" do
        other_user = create(:user, email: "other@email.com")
        create(:concern, user: other_user)
        expect(json.length).to eq(3)
      end

      it "各 concern の内容が正しいこと" do
        expected = concerns.index_by(&:id)

        json.each do |item|
          record = expected.fetch(item["id"])

          expect(item["trigger_event"]).to eq(record.trigger_event)
          expect(item["content"]).to eq(record.content)
        end
      end
    end
  end

  describe "GET /api/v1/concerns/archived" do
    subject(:request_api) { get "/api/v1/concerns/archived" }

    it "自分のアーカイブ済み concern のみ返ること" do
      create(:concern, user: user, archived_at: nil)
      archived_concern = create(:concern, user: user, archived_at: Time.current)

      other_user = create(:user, email: "other@email.com")
      create(:concern, user: other_user, archived_at: Time.current)

      request_api

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.length).to eq(1)
      expect(json[0]["id"]).to eq(archived_concern.id)
      expect(json[0]["archived_at"]).to be_present
    end
  end

  describe "PATCH /api/v1/concerns/:id/archive" do
    subject(:request_api) { patch "/api/v1/concerns/#{concern_id}/archive", headers: csrf_headers }

    context "archived_at が nil の場合" do
      let!(:concern) { create(:concern, user: user, archived_at: nil) }
      let(:concern_id) { concern.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "archived_at に現在時刻が入ること" do
        expect { request_api }.
          to change { concern.reload.archived_at }.
               from(nil)
        expect(concern.reload.archived_at).to be_present
      end
    end

    context "他人の concern をアーカイブしようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_concern) { create(:concern, user: other_user, archived_at: nil) }
      let(:concern_id) { other_concern.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "PATCH /api/v1/concerns/:id/unarchive" do
    subject(:request_api) { patch "/api/v1/concerns/#{concern_id}/unarchive", headers: csrf_headers }

    context "archived_at が存在する場合" do
      let!(:concern) { create(:concern, user: user, archived_at: Time.current) }
      let(:concern_id) { concern.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "archived_at が nil になること" do
        expect { request_api }.
          to change { concern.reload.archived_at }.
               from(concern.archived_at).
               to(nil)
      end
    end

    context "他人の concern のアーカイブを解除しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_concern) { create(:concern, user: other_user, archived_at: Time.current) }
      let(:concern_id) { other_concern.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "GET /api/v1/concerns/:id" do
    subject(:request_api) { get "/api/v1/concerns/#{concern_id}" }

    context "指定したIDのconcernが存在する場合" do
      let!(:concern) { create(:concern, user: user) }
      let(:concern_id) { concern.id }

      context "issue/roadmap が未作成の場合" do
        it "concernが返り、issue と roadmap は nil で返る" do
          request_api
          expect(response).to have_http_status(:ok)

          json = JSON.parse(response.body)
          expect(json["concern"]["id"]).to eq(concern.id)
          expect(json["issue"]).to be_nil
          expect(json["roadmap"]).to be_nil
        end
      end

      context "issue/roadmap が存在する場合" do
        let!(:issue) { create(:issue, user: user, concern: concern) }
        let!(:roadmap) { create(:roadmap, user: user, concern: concern) }

        it "concern と issue と roadmap が返る" do
          request_api
          expect(response).to have_http_status(:ok)

          json = JSON.parse(response.body)
          expect(json["concern"]["id"]).to eq(concern.id)
          expect(json["issue"]["id"]).to eq(issue.id)
          expect(json["roadmap"]["id"]).to eq(roadmap.id)
        end
      end
    end

    context "指定したIDのconcernが存在しない場合" do
      let(:concern_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のconcernを読み取ろうとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_concern) { create(:concern, user: other_user) }
      let(:concern_id) { other_concern.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "PATCH /api/v1/concerns/:id" do
    subject(:request_api) {
      patch "/api/v1/concerns/#{concern_id}",
            params: { concern: params }.to_json,
            headers: csrf_headers
    }

    let!(:concern) { create(:concern, user: user, trigger_event: "元のきっかけ", content: "元の内容") }
    let(:concern_id) { concern.id }

    # 共通で使う JSON パース用ヘルパ
    let(:body) { JSON.parse(response.body) }

    context "指定したIDのconcernが存在し、有効なパラメータを送信した場合" do
      let(:params) do
        {
          trigger_event: "更新後のきっかけ",
          content: "更新後の内容",
        }
      end

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "指定したconcernの内容が更新されること" do
        expect {
          request_api
        }.to change { concern.reload.trigger_event }.from("元のきっかけ").to("更新後のきっかけ").
               and change { concern.reload.content }.from("元の内容").to("更新後の内容")
      end

      it "レスポンスに更新後のデータが含まれていること" do
        request_api

        expect(body["id"]).to eq(concern.id)
        expect(body["trigger_event"]).to eq("更新後のきっかけ")
        expect(body["content"]).to eq("更新後の内容")
      end
    end

    context "指定したIDのconcernが存在しない場合" do
      let(:concern_id) { 999_999 } # 存在しないIDを想定
      let(:params) do
        {
          content: "更新後の内容",
        }
      end

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "パラメータが不正な場合（例: content が空）" do
      let(:params) do
        {
          content: "",
        }
      end

      it "422 Unprocessable Entity が返ること" do
        request_api
        expect(response).to have_http_status(:unprocessable_content)
      end

      it "データが更新されないこと" do
        before_value = concern.reload.content
        request_api
        expect(concern.reload.content).to eq(before_value)
      end
    end

    context "他人のconcernを更新しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_concern) { create(:concern, user: other_user, content: "他人の内容") }
      let(:concern_id) { other_concern.id }

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

  describe "DELETE api/v1/concerns/:id" do
    subject(:request_api) { delete "/api/v1/concerns/#{concern_id}", headers: csrf_headers }

    let!(:concern) { create(:concern, user: user) }
    let(:concern_id) { concern.id }

    context "指定したIDのconcernが存在する場合" do
      it "204 No Content が返ること" do
        request_api
        expect(response).to have_http_status(:no_content)
      end

      it "指定したconcernが削除されること" do
        expect { request_api }.to change { Concern.count }.by(-1)
      end
    end

    context "指定したIDのconcernが存在しない場合" do
      let(:concern_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end

    context "他人のconcernを削除しようとした場合" do
      let(:other_user) { create(:user, email: "other@email.com") }
      let!(:other_concern) { create(:concern, user: other_user) }
      let(:concern_id) { other_concern.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end

      it "他人のデータが削除されないこと" do
        expect {
          request_api
        }.not_to change { Concern.count }
      end
    end
  end
end
