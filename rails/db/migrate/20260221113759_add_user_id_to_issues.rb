class AddUserIdToIssues < ActiveRecord::Migration[8.0]
  def change
    add_reference :issues, :user, null: false, foreign_key: true, index: true
  end
end
