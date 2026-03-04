class AddConcernIdToRoadmaps < ActiveRecord::Migration[8.0]
  def change
    add_reference :roadmaps, :concern, null: false, foreign_key: true, index: { unique: true }
  end
end
