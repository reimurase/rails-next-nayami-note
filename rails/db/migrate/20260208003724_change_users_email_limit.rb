class ChangeUsersEmailLimit < ActiveRecord::Migration[8.0]
  def change
    change_column :users, :email, :string, limit: 255
  end
end
