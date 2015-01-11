PushType::Core::Engine.routes.draw do

  resources :froala_media, only: :create do
    collection do
      get :images
      get :files
    end
  end

end
