/**
 * Init popup for image.
 */
$.Editable.prototype.initImagePopup = function () {
  this.$image_editor = $('<div class="froala-popup froala-image-editor-popup" style="display: none">');

  var $buttons = $('<div class="f-popup-line f-popup-toolbar">').appendTo(this.$image_editor);
  for (var i = 0; i < this.options.imageButtons.length; i++) {
    var cmd = this.options.imageButtons[i];
    if ($.Editable.image_commands[cmd] === undefined) {
      continue;
    }
    var button = $.Editable.image_commands[cmd];

    var btn = '<button class="fr-bttn" data-callback="' + cmd + '" data-cmd="' + cmd + '" title="' + button.title + '">';

    if (this.options.icons[cmd] !== undefined) {
      btn += this.prepareIcon(this.options.icons[cmd], button.title);
    } else {
      btn += this.prepareIcon(button.icon, button.title);
    }

    btn += '</button>';

    $buttons.append(btn);
  }

  this.addListener('hidePopups', this.hideImageEditorPopup);

  if (this.options.imageStyle) {
    $('<div class="f-popup-line f-image-style">').appendTo(this.$image_editor);
    $('<div class="f-popup-line f-image-custom-style">').hide().appendTo(this.$image_editor);
  }

  if (this.options.imageTitle) {
    $('<div class="f-popup-line f-image-alt">')
      .append('<label><span data-text="true">Title</span>: </label>')
      .append($('<input type="text">').on('mouseup keydown', function (e) {
        var keyCode = e.which;
        if (!keyCode || keyCode !== 27) {
          e.stopPropagation();
        }
      }))
      .append('<button class="fr-p-bttn f-ok" data-text="true" data-callback="setImageAlt" data-cmd="setImageAlt" title="OK">OK</button>')
      .appendTo(this.$image_editor);
  }

  this.$popup_editor.append(this.$image_editor);

  this.bindCommandEvents(this.$image_editor);
};


/**
 * Show image editor popup.
 */
$.Editable.prototype.showImageEditorPopup = function () {
  if (this.$image_editor) {
    var _self = this;
    setTimeout( function(){ 
      _self.$image_editor.find('.f-image-style')
        .html('<label><span data-text="true">Style</span>: </label>')
        .append( $('<select />').append( _self.mediaStyleOptions() ).on('change', function(e) {
          _self.setImageStyle();
        }));

      currentStyle = _self.currentMediaStyle();
      $customRow = _self.$image_editor.find('.f-image-custom-style')
        .html('<label><span data-text="true">Size</span>: </label>')
        .append('<input type="text" value="'+ ( $.inArray(currentStyle, _self.options.mediaStyles) === -1 ? currentStyle : '' ) +'">')
        .append('<button class="fr-p-bttn f-ok" data-text="true" data-callback="setImageCustomStyle" data-cmd="setImageCustomStyle" title="OK">OK</button>');
      $.inArray(currentStyle, _self.options.mediaStyles) === -1 ? $customRow.show() : $customRow.hide();
    }, 0);
    this.$image_editor.show();
  }

  if (!this.options.imageMove) {
    this.$element.attr('contenteditable', false);
  }
};


/**
 * Media style options for select
 */
$.Editable.prototype.mediaStyleOptions = function() {
  var currentStyle  = this.currentMediaStyle();

  var options = $.map(this.options.mediaStyles, function(style) {
    var label = style.charAt(0).toUpperCase() + style.substring(1).replace(/_/, ' ');
    return '<option value="'+ style +'"'+ (style == currentStyle ? ' selected' : '') +'>'+ label + '</option>';
  });
  options.push('<option value="_custom"'+ ( $.inArray(currentStyle, this.options.mediaStyles) === -1 ? ' selected' : '' ) +'>Custom</option>');

  return options.join();
}


/**
 * Get the current media style
 */
$.Editable.prototype.currentMediaStyle = function() {
  var $image_editor = this.$element.find('span.f-img-editor');
  var image_src     = $image_editor.find('img').attr('src'),
      mediaMatch    = image_src ? image_src.match(/\?.*style=([\dx]+[%0-9a-z!]*)/i) : false;

  return mediaMatch ? decodeURIComponent(mediaMatch[1]) : 'original';
}


/**
 * Set image styke.
 */
$.Editable.prototype.setImageStyle = function () {
  var $image_editor = this.$element.find('span.f-img-editor'),
      style         = this.$image_editor.find('.f-image-style select').val(),
      image_src     = $image_editor.find('img').attr('src').split('?')[0] + '?style=' + encodeURIComponent(style);

  if (style == '_custom') {
    this.$image_editor.find('.f-image-custom-style').slideDown();
  } else {
    this.$image_editor.find('.f-image-custom-style').slideUp();
    $image_editor.find('img').attr('src', image_src).removeAttr('width');
    this.triggerEvent('imageStyleSet');
  }
};


/**
 * Set image styke.
 */
$.Editable.prototype.setImageCustomStyle = function () {
  var $image_editor = this.$element.find('span.f-img-editor'),
      style         = this.$image_editor.find('.f-image-custom-style input').val(),
      image_src     = $image_editor.find('img').attr('src').split('?')[0] + '?style=' + encodeURIComponent(style);

  $image_editor.find('img').attr('src', image_src).removeAttr('width');

  this.hide();
  this.closeImageMode();
  this.triggerEvent('imageStyleSet');
};