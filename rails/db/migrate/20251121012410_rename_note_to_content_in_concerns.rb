class RenameNoteToContentInConcerns < ActiveRecord::Migration[8.0]
  def change
    rename_column :concerns, :note, :content
  end
end
