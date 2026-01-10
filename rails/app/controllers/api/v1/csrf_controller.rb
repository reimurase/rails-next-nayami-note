class Api::V1::CsrfController < ApplicationController
  skip_before_action :require_login, only: [:show]

  def show
    render json: { csrfToken: form_authenticity_token }
  end
end
