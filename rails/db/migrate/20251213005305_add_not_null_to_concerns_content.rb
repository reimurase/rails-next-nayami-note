class AddNotNullToConcernsContent < ActiveRecord::Migration[8.0]
  def change
    def up
      execute "UPDATE concerns SET content = '' WHERE content IS NULL"

      # NULL禁止
      change_column_null :concerns, :content, false
    end

    def down
      change_column_null :concerns, :content, true
    end
  end
end
