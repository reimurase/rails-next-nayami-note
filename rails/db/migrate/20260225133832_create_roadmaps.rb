class CreateRoadmaps < ActiveRecord::Migration[8.0]
  def change
    create_table :roadmaps do |t|
      t.string :goal
      t.text :content

      t.timestamps
    end
  end
end
