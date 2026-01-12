# spec/requests/api/v1/csrf_spec.rb
require "rails_helper"

RSpec.describe "CSRF protection", type: :request do
  around do |example|
    old = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true
    example.run
    ActionController::Base.allow_forgery_protection = old
  end

  let(:user) { create(:user) }
  let!(:concern) { create(:concern, user: user) }

  it "CSRFトークンなしのPATCHは弾かれる" do
    login_as(user)

    patch "/api/v1/concerns/#{concern.id}", params: {
      concern: { title: "no csrf" },
    }

    expect(response).to have_http_status(:unprocessable_content)
  end

  it "CSRFトークンありのPATCHは通る" do
    login_as(user)

    patch "/api/v1/concerns/#{concern.id}",
          params: { concern: { trigger_event: "更新後のきっかけ" } }.to_json,
          headers: csrf_headers

    expect(response).to have_http_status(:ok).or have_http_status(:no_content)
  end
end
