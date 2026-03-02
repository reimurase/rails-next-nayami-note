class ChangeTitleConstraintOnIssues < ActiveRecord::Migration[8.0]
  def change
    execute "UPDATE issues SET title = '' WHERE title IS NULL"

    # NULL禁止 + default 空文字
    change_column_default :issues, :title, ""
    change_column_null :issues, :title, false
  end

  def down
    change_column_null :issues, :title, true
    change_column_default :issues, :title, nil
  end
end
