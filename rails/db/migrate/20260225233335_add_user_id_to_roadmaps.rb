class AddUserIdToRoadmaps < ActiveRecord::Migration[8.0]
  def change
    add_reference :roadmaps, :user, null: false, foreign_key: true, index: true
  end
end
