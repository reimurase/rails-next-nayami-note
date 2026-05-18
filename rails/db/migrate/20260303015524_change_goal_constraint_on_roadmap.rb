class ChangeGoalConstraintOnRoadmap < ActiveRecord::Migration[8.0]
  def up
    execute "UPDATE roadmaps SET goal = '' WHERE goal IS NULL"

    # NULL禁止 + default 空文字
    change_column_default :roadmaps, :goal, ""
    change_column_null :roadmaps, :goal, false
  end

  def down
    change_column_null :roadmaps, :goal, true
    change_column_default :roadmaps, :goal, nil
  end
end
