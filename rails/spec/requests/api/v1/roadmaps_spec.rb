# spec/requests/api/v1/roadmaps_spec.rb
require "rails_helper"

RSpec.describe "Api::V1::Roadmaps", type: :request do
  let(:user) { create(:user) }

  before do
    login_as(user)
  end

  describe "GET /api/v1/roadmaps" do
    subject(:request_api) { get "/api/v1/roadmaps" }

    let(:json) { JSON.parse(response.body) }

    context "roadmapが0件の場合" do
      it "空配列が返ること" do
        request_api
        expect(json).to eq([])
        expect(response).to have_http_status(:ok)
      end
    end

    context "roadmapが複数件の場合" do
      let!(:concerns) { create_list(:concern, 3, user: user) }
      let!(:roadmaps) do
        concerns.map {|c| create(:roadmap, user: user, concern: c) }
      end

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
          expect(item["concern_id"]).to eq(record.concern_id)
        end
      end
    end
  end
end
