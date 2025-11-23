require "rails_helper"

RSpec.describe Concern, type: :model do
  context "concernの新規作成" do
    it "factoryが有効であること" do
      expect(build(:concern)).to be_valid
    end

    it "concernsテーブルに正常に新規作成できる" do
      expect { create(:concern) }.to change { Concern.count }.by(1)
    end
  end
end
