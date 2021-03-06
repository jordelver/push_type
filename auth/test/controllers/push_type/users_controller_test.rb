require "test_helper"

module PushType
  describe UsersController do

    let(:current_user) { FactoryGirl.create(:confirmed_user) }
    let(:user) { FactoryGirl.create :user }
    before { sign_in current_user }

    let(:last_email) { ActionMailer::Base.deliveries.last }
    
    describe 'PUT #invite' do
      let(:referer) { '/push_type/users' }
      before do
        @request.env["HTTP_REFERER"] = referer
        put :invite, id: user.id
      end
      it { response.must_redirect_to referer }
      it { last_email.to.must_include user.email }
      it { last_email.subject.must_equal 'Confirmation instructions' }
    end

  end
end
