class ChangeTriggerEventConstraintOnConcerns < ActiveRecord::Migration[8.0]
  def up
    execute "UPDATE concerns SET trigger_event = '' WHERE trigger_event IS NULL"

    # NULL禁止 + default 空文字
    change_column_default :concerns, :trigger_event, ""
    change_column_null :concerns, :trigger_event, false
  end

  def down
    change_column_null :concerns, :trigger_event, true
    change_column_default :concerns, :trigger_event, nil
  end
end
