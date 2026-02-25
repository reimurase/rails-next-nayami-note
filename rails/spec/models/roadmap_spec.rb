# spec/models/roadmap_spec.rb
require "rails_helper"

RSpec.describe Roadmap, type: :model do
  it "valid であること" do
    roadmap = build(:roadmap)
    expect(roadmap).to be_valid
  end
end
