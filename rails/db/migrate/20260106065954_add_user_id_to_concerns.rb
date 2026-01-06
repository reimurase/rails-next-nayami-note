class AddUserIdToConcerns < ActiveRecord::Migration[8.0]
  def change
    add_reference :concerns, :user, null: false, foreign_key: true, index: true
  end
end
