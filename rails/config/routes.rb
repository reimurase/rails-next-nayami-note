Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
    end
  end

  root to: proc { [200, {}, ['{"status":"ok"}']] }
end
