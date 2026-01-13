# spec/requests/api/v1/csrf_spec.rb
require "rails_helper"

RSpec.describe "CSRF protection", type: :request do
  let(:user) { create(:user) }
  let!(:concern) { create(:concern, user: user) }

  it "CSRFトークンなしのPATCHは弾かれる" do
    login_as(user)

    patch "/api/v1/concerns/#{concern.id}",
          params: { concern: { trigger_event: "no csrf" } }.to_json,
          headers: json_headers

    expect(response).to have_http_status(:unprocessable_content)
  end

  it "CSRFトークンありのPATCHは通る" do
    login_as(user)

    patch "/api/v1/concerns/#{concern.id}",
          params: { concern: { trigger_event: "with csrf" } }.to_json,
          headers: csrf_headers

    expect(response).to have_http_status(:ok).or have_http_status(:no_content)
  end
end
