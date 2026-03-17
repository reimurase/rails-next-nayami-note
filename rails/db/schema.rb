# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_03_17_054758) do
  create_table "concerns", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "trigger_event", default: "", null: false, comment: "なやみのきっかけ（任意）"
    t.bigint "user_id", null: false
    t.datetime "archived_at"
    t.index ["archived_at"], name: "index_concerns_on_archived_at"
    t.index ["user_id"], name: "index_concerns_on_user_id"
  end

  create_table "issues", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title", default: "", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "concern_id", null: false
    t.index ["concern_id"], name: "index_issues_on_concern_id", unique: true
    t.index ["user_id"], name: "index_issues_on_user_id"
  end

  create_table "roadmaps", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "goal", default: "", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "concern_id", null: false
    t.index ["concern_id"], name: "index_roadmaps_on_concern_id", unique: true
    t.index ["user_id"], name: "index_roadmaps_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "concerns", "users"
  add_foreign_key "issues", "concerns"
  add_foreign_key "issues", "users"
  add_foreign_key "roadmaps", "concerns"
  add_foreign_key "roadmaps", "users"
end
