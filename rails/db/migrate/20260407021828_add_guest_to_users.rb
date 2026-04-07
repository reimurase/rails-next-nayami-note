class AddGuestToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :guest, :boolean, default: false, null: false
  end
end
