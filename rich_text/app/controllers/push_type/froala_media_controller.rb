require_dependency "push_type/admin_controller"

module PushType
  class FroalaMediaController < AdminController

    before_filter :build_asset, only: :create

    respond_to :json

    def images
      respond_with PushType::Asset.image.all.map { |a| asset_to_hash(a) }
    end

    def files
      respond_with PushType::Asset.not_image.all.map { |a| asset_to_hash(a) }
    end

    def create
      respond_with save_asset!, location: false
    end

    private

    def asset_params
      params.fetch(:asset, {}).permit(:file)
    end

    def build_asset
      @asset = PushType::Asset.new asset_params.merge(uploader: push_type_user)
    end

    def save_asset!
      if @asset.save
        { link: main_app.media_url(@asset.file_uid) }
      else
        { error: @asset.errors.full_messages.first }
      end
    end

    def asset_to_hash(a)
      {
        src: a.image? ? main_app.media_url(a.file_uid, style: '300x300#') : ActionController::Base.helpers.image_url("push_type/icon-file-#{ a.kind }.png"),
        info: {
          id:    a.id,
          kind:  a.kind,
          src:   main_app.media_url(a.file_uid),
          title: a.description_or_file_name
        }
      }
    end

  end
end
