Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      get "me", to: "me#show"
      patch "me/auto_archive", to: "me#update_auto_archive"
      resource :csrf, only: [:show], controller: "csrf"
      resources :users, only: [:create]
      resource :session, only: [:create, :destroy]
      resource :password, only: [], controller: "passwords" do
        collection do
          post :reset_request
          post :reset
        end
      end

      resources :concerns, only: [:index, :show, :create, :update, :destroy] do
        resource :issue, module: :concerns, only: [:create, :update, :destroy]
        resource :roadmap, module: :concerns, only: [:create, :update, :destroy]

        collection do
          get :archived
        end

        member do
          patch :archive
          patch :unarchive
        end
      end

      # 一覧表示用
      resources :issues, only: [:index] do
        collection do
          get :archived
        end

        member do
          patch :archive
          patch :unarchive
        end
      end

      resources :roadmaps, only: [:index] do
        collection do
          get :archived
        end

        member do
          patch :archive
          patch :unarchive
        end
      end
    end
  end

  root to: proc { [200, {}, ['{"status":"ok"}']] }
end
