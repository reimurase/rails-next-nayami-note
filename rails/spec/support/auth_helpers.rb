module AuthHelpers
  def login_as(user)
    post "/api/v1/session", params: {
      session: { email: user.email, password: "password" },
    }
  end
end
