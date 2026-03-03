class AddNotNullToIssuesContent < ActiveRecord::Migration[8.0]
  def change
    def up
      execute "UPDATE issues SET content = '' WHERE content IS NULL"

      # NULL禁止
      change_column_null :issues, :content, false
    end

    def down
      change_column_null :issues, :content, true
    end
  end
end
