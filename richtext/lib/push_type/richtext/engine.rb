module PushType
  module Richtext
    class Engine < ::Rails::Engine
      isolate_namespace PushType
      engine_name 'push_type_richtext'

      config.generators do |g|
        g.assets false
        g.helper false
        g.test_framework  :minitest, spec: true, fixture: false
      end
    end
  end
end
