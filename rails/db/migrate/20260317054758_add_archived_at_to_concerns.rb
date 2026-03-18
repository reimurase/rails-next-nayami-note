class AddArchivedAtToConcerns < ActiveRecord::Migration[8.0]
  def change
    add_column :concerns, :archived_at, :datetime, null: true
    add_index :concerns, :archived_at
  end
end
