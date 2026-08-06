require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
# require "action_cable/engine"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RailsNextNayamiNote
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # I18nライブラリに訳文の探索場所を指示する
    config.i18n.load_path += Dir[Rails.root.join("config", "locales", "**", "*.{rb,yml}").to_s]
    config.i18n.default_locale = :ja
    config.i18n.available_locales = [:ja]

    config.middleware.use ActionDispatch::Cookies

    cookie_opts =
      if Rails.env.test? || Rails.env.development?
        {
          key: "_rails_next_nayami_note_session",
          secure: false,
          same_site: :lax,
          httponly: true,
        }
      else
        {
          key: "_rails_next_nayami_note_session",
          secure: true,
          same_site: :lax,
          httponly: true,
        }
      end

    config.middleware.use ActionDispatch::Session::CookieStore, cookie_opts

    config.active_support.to_time_preserves_timezone = :zone
  end
end
