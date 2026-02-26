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
end
