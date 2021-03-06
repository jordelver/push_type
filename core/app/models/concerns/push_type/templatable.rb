module PushType
  module Templatable
    extend ActiveSupport::Concern

    def template
      self.class.template_path
    end

    def template_args
      [template, self.class.template_opts.except!(:path)]
    end

    module ClassMethods

      def template(name, opts = {})
        @template_name = name
        @template_opts = opts
      end

      def template_name
        @template_name || self.name.underscore
      end

      def template_path
        File.join template_opts[:path], template_name
      end

      def template_opts
        { path: 'nodes' }.merge(@template_opts || {})
      end

    end

  end  
end