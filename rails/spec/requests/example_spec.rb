require "rails_helper"

RSpec.describe "Smoke test", type: :request do
  it "動作確認のための足し算" do
    expect(1 + 1).to eq 2
  end
end
