Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      get "me", to: "me#show"
      resource :csrf, only: [:show], controller: "csrf"
      resources :users, only: [:create]
      resource :session, only: [:create, :destroy]

      resources :concerns, only: [:index, :show, :create, :update, :destroy] do
        resource :issue, module: :concerns, only: [:show, :create, :update, :destroy]
      end

      # 一覧表示用
      resources :issues, only: [:index]
      resources :roadmaps, only: [:index, :show, :create, :update, :destroy]
    end
  end

  root to: proc { [200, {}, ['{"status":"ok"}']] }
end
