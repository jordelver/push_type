unless ENV['PUSH_TYPE_ENV'] == 'test'
  require 'push_type_core'
  require 'push_type_admin'
  require 'push_type_rich_text'
  require 'push_type_auth'
end