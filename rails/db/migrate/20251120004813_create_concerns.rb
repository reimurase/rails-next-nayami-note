class CreateConcerns < ActiveRecord::Migration[8.0]
  def change
    create_table :concerns do |t|
      t.text :note

      t.timestamps
    end
  end
end
