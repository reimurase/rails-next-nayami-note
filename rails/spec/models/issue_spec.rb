# spec/models/issue_spec.rb
require "rails_helper"

RSpec.describe Issue, type: :model do
  it "valid であること" do
    issue = build(:issue)
    expect(issue).to be_valid
  end
end
