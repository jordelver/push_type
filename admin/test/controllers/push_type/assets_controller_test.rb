require "test_helper"

module PushType
  describe AssetsController do

    let(:asset_attrs) { FactoryGirl.attributes_for(:asset) }
    let(:asset) { FactoryGirl.create :asset }
    
    describe 'GET #index' do
      before do
        5.times { FactoryGirl.create :asset }
        get :index
      end
      it { response.must_render_template 'index' }
      it { assigns[:assets].size.must_equal 5 }
    end

    describe 'GET #new' do
      before { get :new }
      it { response.must_render_template 'new' }
      it { assigns[:asset].must_be :new_record? }
      it { assigns[:asset].must_be_instance_of Asset }
    end

    describe 'POST #create' do
      let(:action!) { post :create, asset: asset_attrs }
      describe 'with valid asset' do
        before { action! }
        it { response.must_respond_with :redirect }
        it { flash[:notice].must_be :present? }
      end
      describe 'asset count' do
        it { proc { action! }.must_change 'Asset.count', 1 }
      end
      describe 'with in-valid asset' do
        let(:asset_attrs) { {} }
        before { action! }
        it { response.must_render_template 'new' }
        it { assigns[:asset].errors.must_be :present? }
      end
    end

    describe 'GET #edit' do
      before { get :edit, id: asset.id }
      it { response.must_render_template 'edit' }
      it { assigns[:asset].must_equal asset }
    end

    describe 'PUT #update' do
      before { put :update, id: asset.id, asset: { description: new_description } }
      describe 'with valid asset' do
        let(:new_description) { 'Foo bar baz' }
        it { response.must_respond_with :redirect }
        it { flash[:notice].must_be :present? }
        it { asset.reload.description.must_equal new_description }
      end
    end

    describe 'DELETE #destroy' do
      before { delete :destroy, id: asset.id }
      it { response.must_respond_with :redirect }
      it { flash[:notice].must_be :present? }
      it { asset.reload.must_be :trashed? }
    end

  end
end
