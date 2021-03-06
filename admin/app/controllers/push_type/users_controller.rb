require_dependency "push_type/admin_controller"

module PushType
  class UsersController < AdminController

    before_filter :build_user,  only: [:new, :create]
    before_filter :load_user,   only: [:edit, :update, :destroy]

    def index
      @users = user_scope.page(params[:page])
    end

    def new
    end

    def create
      if @user.save
        flash[:notice] = 'User successfully created.'
        redirect_to push_type.users_path
      else
        render 'new'
      end
    end

    def edit
    end

    def update
      if @user.update_attributes user_params
        flash[:notice] = 'User successfully updated.'
        redirect_to push_type.users_path
      else
        render 'edit'
      end
    end

    def destroy
      if @user != push_type_user
        @user.destroy
        flash[:notice] = 'User deleted.'
        redirect_to push_type.users_path
      else
        flash[:alert] = 'Trying to delete yourself is the thirty seventh sign of madness.'
        redirect_to :back
      end
    end

    private

    def initial_breadcrumb
      breadcrumbs.add 'Users', push_type.users_path
    end

    def user_scope
      @user_scope ||= PushType::User
    end

    def build_user
      @user = user_scope.new
      @user.attributes = @user.attributes.merge(user_params)
    end

    def load_user
      @user = user_scope.find params[:id]
    end

    def user_params
      fields = [:name, :email] + @user.fields.keys
      params.fetch(:user, {}).permit(*fields)
    end

  end
end
