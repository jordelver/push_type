PushType::Core::Engine.routes.draw do

  resources :froala_media, only: [:index, :create]

end
