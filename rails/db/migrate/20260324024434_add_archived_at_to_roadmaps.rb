class AddArchivedAtToRoadmaps < ActiveRecord::Migration[8.0]
  def change
    add_column :roadmaps, :archived_at, :datetime, null: true
    add_index :roadmaps, :archived_at
  end
end
