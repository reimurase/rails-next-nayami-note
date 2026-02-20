# spec/requests/api/v1/issues_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Issues", type: :request do
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

      it "各 issue の内容が正しいこと" do
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
end
