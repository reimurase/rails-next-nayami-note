# spec/requests/api/v1/issues_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Issues", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user, email: "other@email.com") }

  before do
    login_as(user)
  end

  describe "GET /api/v1/issues" do
    subject(:request_api) { get "/api/v1/issues" }

    it "未アーカイブのみ返ること" do
      active_issue = create(:issue, user: user, archived_at: nil, concern: create(:concern, user: user))
      create(:issue, user: user, archived_at: Time.current, concern: create(:concern, user: user))

      request_api
      json = JSON.parse(response.body)

      returned_ids = json.map {|item| item["id"] }

      expect(response).to have_http_status(:ok)
      expect(returned_ids).to eq([active_issue.id])
      expect(json[0]["archived_at"]).to be_nil
    end

    context "issueが0件の場合" do
      it "空配列が返ること" do
        request_api
        expect(JSON.parse(response.body)).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "自分と他人の issue が存在する場合" do
      let!(:concerns) { create_list(:concern, 3, user: user) }
      let!(:issues) do
        concerns.map {|c| create(:issue, user: user, concern: c) }
      end

      it "200 OK が返ること" do
        create(:issue, user: other_user, concern: create(:concern, user: other_user))

        request_api

        expect(response).to have_http_status(:ok)
      end

      it "自分の issues のみが返ること" do
        other_issue = create(:issue, user: other_user, concern: create(:concern, user: other_user))

        request_api

        json = JSON.parse(response.body)
        expect(json.length).to eq(3)

        returned_ids = json.map {|item| item["id"] }
        expect(returned_ids).to match_array(issues.map(&:id))
        expect(returned_ids).not_to include(other_issue.id)
      end

      it "各 issue の内容が正しいこと" do
        request_api

        expected = issues.index_by(&:id)

        json = JSON.parse(response.body)
        json.each do |item|
          record = expected.fetch(item["id"])

          expect(item["title"]).to eq(record.title)
          expect(item["content"]).to eq(record.content)
          expect(item["concern_id"]).to eq(record.concern_id)
        end
      end
    end
  end

  describe "GET /api/v1/issues/archived" do
    subject(:request_api) { get "/api/v1/issues/archived" }

    it "自分のアーカイブ済み issue のみ返ること" do
      create(:issue, user: user, archived_at: nil, concern: create(:concern, user: user))
      archived_issue = create(:issue, user: user, archived_at: Time.current, concern: create(:concern, user: user))

      create(:issue, user: other_user, archived_at: Time.current, concern: create(:concern, user: other_user))

      request_api

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.length).to eq(1)
      expect(json[0]["id"]).to eq(archived_issue.id)
      expect(json[0]["archived_at"]).to be_present
    end
  end

  describe "PATCH /api/v1/issues/:id/archive" do
    subject(:request_api) { patch "/api/v1/issues/#{issue_id}/archive", headers: csrf_headers }

    context "archived_at が nil の場合" do
      let!(:concern) { create(:concern, user: user) }
      let!(:issue) { create(:issue, user: user, archived_at: nil, concern: concern) }
      let(:issue_id) { issue.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "archived_at に現在時刻が入ること" do
        expect { request_api }.
          to change { issue.reload.archived_at }.
               from(nil)
        expect(issue.reload.archived_at).to be_present
      end
    end

    context "他人の issue をアーカイブしようとした場合" do
      let!(:other_concern) { create(:concern, user: other_user) }
      let!(:other_issue) { create(:issue, user: other_user, archived_at: nil, concern: other_concern) }
      let(:issue_id) { other_issue.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "PATCH /api/v1/issues/:id/unarchive" do
    subject(:request_api) { patch "/api/v1/issues/#{issue_id}/unarchive", headers: csrf_headers }

    context "archived_at が存在する場合" do
      let!(:issue) { create(:issue, user: user, archived_at: Time.current, concern: create(:concern, user: user)) }
      let(:issue_id) { issue.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "archived_at が nil になること" do
        expect { request_api }.
          to change { issue.reload.archived_at }.
               from(issue.archived_at).
               to(nil)
      end
    end

    context "他人の issue のアーカイブを解除しようとした場合" do
      let!(:other_issue) { create(:issue, user: other_user, archived_at: Time.current, concern: create(:concern, user: other_user)) }
      let(:issue_id) { other_issue.id }

      it "404 Not Found が返ること（存在を隠す）" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
