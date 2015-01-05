require "test_helper"

module PushType
  describe RichTextField do
    let(:field) { PushType::RichTextField.new :foo }
    it { field.form_helper.must_equal :text_area }
    it { field.html_options[:class].must_equal 'froala' }
  end
end
