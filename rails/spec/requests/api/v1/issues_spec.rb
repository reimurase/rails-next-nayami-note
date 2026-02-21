# spec/requests/api/v1/issues_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Issues", type: :request do
  describe "POST api/v1/issues" do
    subject(:request_api) {
      post "/api/v1/issues",
           params: { issue: params }.to_json,
           headers: csrf_headers
    }

    let(:valid_params) do
      {
        title: "テストのタイトル",
        content: "テストの問題",
      }
    end

    context "パラメータが正しいとき" do
      let(:params) { valid_params }

      it "レコードを1件作成し、201を返す" do
        expect { request_api }.to change { Issue.count }.by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["title"]).to eq "テストのタイトル"
        expect(json["content"]).to eq "テストの問題"
      end
    end
  end

  describe "GET /api/v1/issues" do
    subject(:request_api) { get "/api/v1/issues" }

    let(:json) { JSON.parse(response.body) }

    context "issueが0件の場合" do
      before do
        request_api
      end

      it "空配列が返ること" do
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "issueが複数件の場合" do
      let!(:issues) { create_list(:issue, 3) }

      before do
        request_api
      end

      it "200 OK が返ること" do
        expect(response).to have_http_status(:ok)
      end

      it "issues が期待した件数返ること" do
        expect(json.length).to eq(3)
      end

      it "各 issue の問題が正しいこと" do
        expected = issues.index_by(&:id)

        json.each do |item|
          record = expected.fetch(item["id"])

          expect(item["title"]).to eq(record.title)
          expect(item["content"]).to eq(record.content)
        end
      end
    end
  end

  describe "GET /api/v1/issues/:id" do
    subject(:request_api) { get "/api/v1/issues/#{issue_id}" }

    context "指定したIDのissueが存在する場合" do
      let!(:issue) { create(:issue) }
      let(:issue_id) { issue.id }

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end
    end

    context "指定したIDのissueが存在しない場合" do
      let(:issue_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "PATCH api/v1/issues/:id" do
    subject(:request_api) {
      patch "/api/v1/issues/#{issue_id}",
            params: { issue: params }.to_json,
            headers: csrf_headers
    }

    let!(:issue) { create(:issue, title: "元のタイトル", content: "元の問題") }
    let(:issue_id) { issue.id }

    # 共通で使う JSON パース用ヘルパ
    let(:body) { JSON.parse(response.body) }

    context "指定したIDのissueが存在し、有効なパラメータを送信した場合" do
      let(:params) do
        {
          title: "更新後のタイトル",
          content: "更新後の問題",
        }
      end

      it "200 OK が返ること" do
        request_api
        expect(response).to have_http_status(:ok)
      end

      it "指定したissueの問題が更新されること" do
        expect {
          request_api
        }.to change { issue.reload.title }.from("元のタイトル").to("更新後のタイトル").
               and change { issue.reload.content }.from("元の問題").to("更新後の問題")
      end

      it "レスポンスに更新後のデータが含まれていること" do
        request_api

        expect(body["id"]).to eq(issue.id)
        expect(body["title"]).to eq("更新後のタイトル")
        expect(body["content"]).to eq("更新後の問題")
      end
    end

    context "指定したIDのissueが存在しない場合" do
      let(:issue_id) { 999_999 } # 存在しないIDを想定
      let(:params) do
        {
          content: "更新後の問題",
        }
      end

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE api/v1/issues/:id" do
    subject(:request_api) { delete "/api/v1/issues/#{issue_id}", headers: csrf_headers }

    let!(:issue) { create(:issue) }
    let(:issue_id) { issue.id }

    context "指定したIDのissueが存在する場合" do
      it "204 No Content が返ること" do
        request_api
        expect(response).to have_http_status(:no_content)
      end

      it "指定したissueが削除されること" do
        expect { request_api }.to change { Issue.count }.by(-1)
      end
    end

    context "指定したIDのissueが存在しない場合" do
      let(:issue_id) { 999_999 }

      it "404 Not Found が返ること" do
        request_api
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
