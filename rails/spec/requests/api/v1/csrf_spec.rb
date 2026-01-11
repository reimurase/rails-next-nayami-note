# # spec/requests/api/v1/csrf_spec.rb
# require "rails_helper"

# RSpec.describe "CSRF protection", type: :request do
#   around do |example|
#     old = ActionController::Base.allow_forgery_protection
#     ActionController::Base.allow_forgery_protection = true
#     example.run
#     ActionController::Base.allow_forgery_protection = old
#   end

#   let(:user) { create(:user, password: "password", password_confirmation: "password") }
#   let!(:concern) { create(:concern, user: user) }

#   def csrf_token!
#     get "/api/v1/csrf"
#     expect(response).to have_http_status(:ok)
#     response.parsed_body.fetch("csrfToken")
#   end

#   def login!
#     token = csrf_token!

#     post "/api/v1/session", params: {
#       session: { email: user.email, password: "password" },
#       headers: { "X-CSRF-Token" => token }
#     }
#     puts "STATUS: #{response.status}"
#     puts "BODY: #{response.body}"
#     puts "SET_COOKIE: #{response.headers['Set-Cookie']}"

#     expect(response).to have_http_status(:ok)
#   end

#   it "CSRFトークンなしのPATCHは弾かれる" do
#     login!

#     patch "/api/v1/concerns/#{concern.id}", params: {
#       concern: { title: "no csrf" },
#     }

#     expect(response).to have_http_status(:unprocessable_entity)
#   end

#   it "CSRFトークンありのPATCHは通る" do
#     login!
#     token = csrf_token!

#     patch "/api/v1/concerns/#{concern.id}",
#           params: { concern: { title: "with csrf" } },
#           headers: { "X-CSRF-Token" => token }

#     expect(response).to have_http_status(:ok).or have_http_status(:no_content)
#   end
# end
