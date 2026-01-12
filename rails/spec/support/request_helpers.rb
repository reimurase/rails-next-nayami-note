module RequestHelpers
  def json_headers
    {
      "ACCEPT" => "application/json",
      "CONTENT_TYPE" => "application/json",
    }
  end

  def csrf_token
    get "/api/v1/csrf", headers: json_headers
    expect(response).to have_http_status(:ok)
    JSON.parse(response.body).fetch("csrfToken")
  end

  def login_as(user)
    token = csrf_token

    post "/api/v1/session",
         params: {
           session: {
             email: user.email,
             password: "password",
           },
         }.to_json,
         headers: json_headers.merge("X-CSRF-Token" => token)

    expect(response).to have_http_status(:ok)
  end

  def csrf_headers
    json_headers.merge("X-CSRF-Token" => csrf_token)
  end
end
