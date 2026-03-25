class AddAutoArchivedEnabledToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :auto_archive_enabled, :boolean, default: false, null: false
  end
end
