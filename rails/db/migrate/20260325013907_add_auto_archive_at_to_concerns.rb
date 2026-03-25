class AddAutoArchiveAtToConcerns < ActiveRecord::Migration[8.0]
  def change
    add_column :concerns, :auto_archive_at, :datetime
  end
end
