class Api::V1::UsersController < ApplicationController
  def show
  end

  def create
    user = User.new(user_params)
    user.save!
    head :created
  end

  def destroy
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
