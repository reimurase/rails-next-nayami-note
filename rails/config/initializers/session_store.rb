Rails.application.config.session_store :cookie_store,
                                       key: "_rails_next_nayami_note_session",
                                       secure: true,
                                       same_site: :none,
                                       httponly: true
