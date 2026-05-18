class AddNotNullToRoadmapContent < ActiveRecord::Migration[8.0]
  def up
    execute "UPDATE roadmaps SET content = '' WHERE content IS NULL"

    # NULL禁止
    change_column_null :roadmaps, :content, false
  end

  def down
    change_column_null :roadmaps, :content, true
  end
end
