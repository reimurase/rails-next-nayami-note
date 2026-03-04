# spec/requests/api/v1/issues_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Issues", type: :request do
  let(:user) { create(:user) }

  before do
    login_as(user)
  end

  describe "GET /api/v1/issues" do
    subject(:request_api) { get "/api/v1/issues" }

    let(:json) { JSON.parse(response.body) }

    context "issueが0件の場合" do
      it "空配列が返ること" do
        request_api
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "issueが複数件の場合" do
      let!(:concerns) { create_list(:concern, 3, user: user) }
      let!(:issues) do
        concerns.map {|c| create(:issue, user: user, concern: c) }
      end

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
          expect(item["concern_id"]).to eq(record.concern_id)
        end
      end
    end
  end
end
