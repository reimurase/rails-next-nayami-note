# spec/requests/api/v1/me_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Me", type: :request do
  describe "GET /api/v1/me" do
    context "未ログインの場合" do
      it "401 を返す" do
        get "/api/v1/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログインしている場合" do
      it "200 を返し、 id/email を返す" do
        user = create(:user)

        login_as(user)

        expect(response).to have_http_status(:ok)

        get "/api/v1/me"

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        expect(json["id"]).to eq(user.id)
        expect(json["email"]).to eq(user.email)
      end
    end

    context "ログアウトする場合" do
      it "/me が 401 になる" do
        user = create(:user)

        login_as(user)

        expect(response).to have_http_status(:ok)

        # logged in確認
        get "/api/v1/me"
        expect(response).to have_http_status(:ok)

        # logout
        delete "/api/v1/session", headers: csrf_headers
        expect(response).to have_http_status(:no_content)

        # logout後の確認
        get "/api/v1/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/me/auto_archive" do
    subject(:request_api) do
      patch "/api/v1/me/auto_archive",
            params: request_params.to_json,
            headers: csrf_headers
    end

    let(:user) { create(:user) }
    let(:false_params) { { auto_archive_enabled: false } }
    let(:true_params) { { auto_archive_enabled: true } }

    before do
      login_as(user)
    end

    context "自動アーカイブ設定をOFFにする場合" do
      let(:request_params) { false_params }

      before do
        user.update!(auto_archive_enabled: true)
      end

      it "OFFにできること" do
        request_api

        expect(response).to have_http_status(:ok)
        expect(user.reload.auto_archive_enabled).to be(false)
      end

      it "未アーカイブ concern の予約が消えること" do
        scheduled_concern = create(
          :concern,
          user: user,
          archived_at: nil,
          auto_archive_at: 7.days.from_now,
        )

        request_api

        expect(scheduled_concern.reload.auto_archive_at).to be_nil
      end

      it "auto_archive_at が nil の concern はそのまま nil が返ること" do
        unscheduled_concern = create(
          :concern,
          user: user,
          archived_at: nil,
          auto_archive_at: nil,
        )

        request_api

        expect(unscheduled_concern.reload.auto_archive_at).to be_nil
      end
    end

    context "自動アーカイブ設定をONにする場合" do
      let(:request_params) { true_params }

      it "既存の未アーカイブ concern に予約を付け直さないこと" do
        user.update!(auto_archive_enabled: false)

        concern = create(
          :concern,
          user: user,
          archived_at: nil,
          auto_archive_at: nil,
        )

        request_api

        expect(response).to have_http_status(:ok)
        expect(user.reload.auto_archive_enabled).to be(true)
        expect(concern.reload.auto_archive_at).to be_nil
      end
    end
  end
end
