class AddTriggerEventToConcerns < ActiveRecord::Migration[8.0]
  def change
    add_column :concerns, :trigger_event, :string,  null: true, comment: "なやみのきっかけ（任意）"
  end
end
