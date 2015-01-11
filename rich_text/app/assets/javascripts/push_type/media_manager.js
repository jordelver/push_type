$.Editable.prototype.showMediaManager = function (kind) {
  this.$image_modal.find('h4 span').text('Manage '+ kind +'s');
  this.$image_modal.show();
  this.$overlay.show();
  if (kind == 'file') {
    this.loadFiles();
  } else {
    this.loadImages();
  }
  $('body').css('overflow','hidden');
}


$.Editable.prototype.buildMediaManager = function () {
  this.$image_modal = $(this.mediaModalHTML()).appendTo('body');
  this.$preloader = this.$image_modal.find('#f-preloader-' + this._id);
  this.$media_images = this.$image_modal.find('#f-image-list-' + this._id);
  this.$overlay = $('<div class="froala-overlay">').appendTo('body');

  // Stop event propagation on overlay.
  this.$overlay.on('mouseup', $.proxy(function (e) {
    if (!this.isResizing()) {
      e.stopPropagation();
    }
  }, this));


  // Stop event propagation in modal.
  this.$image_modal.on('mouseup', $.proxy(function (e) {
    if (!this.isResizing()) {
      e.stopPropagation();
    }
  }, this));

  // Close button.
  this.$image_modal.find('i#f-modal-close-' + this._id)
    .click($.proxy(function () {
      this.hideMediaManager();
    }, this));

  // Select image.
  this.$media_images.on(this.mouseup, 'img', $.proxy(function (e) {
    e.stopPropagation();
    var img = e.currentTarget;
    if ( $(img).data('kind') == 'image' ) {
      this.writeImage($(img).data('src'));
    } else {
      this.writeFile($(img).data('src'), $(img).data('title'));
    }
    this.hideMediaManager();
  }, this));

  // Delete image.
  this.$media_images.on(this.mouseup, '.f-delete-img', $.proxy(function (e) {
    e.stopPropagation();
    var img = $(e.currentTarget).prev();
    var message = 'Are you sure? Image will be deleted.';
    if ($.Editable.LANGS[this.options.language]) {
      message = $.Editable.LANGS[this.options.language].translation[message];
    }

    // Ask for confirmation.
    if (confirm(message)) {
      if (this.triggerEvent('beforeDeleteImage', [$(img)], false) !== false) {
        $(img).parent().addClass('f-img-deleting');
        this.deleteImage($(img));
      }
    }
  }, this));

  // Add button for media manager to image.
  if (this.options.mediaManager) {
    this.$image_wrapper
      .on('click', '#f-browser-' + this._id, $.proxy(function () {
        this.showMediaManager('image');
      }, this))
      .on('click', '#f-browser-' + this._id + ' i', $.proxy(function () {
        this.showMediaManager('image');
      }, this));

    this.$image_wrapper.find('#f-browser-' + this._id).show();
  }

  this.hideMediaManager();
};

// Load images from server.
$.Editable.prototype.loadFiles = function () {
  this.$preloader.show();
  this.$media_images.empty();

  if (this.options.filesLoadURL) {
    $.support.cors = true;
    $.getJSON(this.options.filesLoadURL, this.options.imagesLoadParams, $.proxy(function (data) {
      // data
      this.triggerEvent('imagesLoaded', [data], false);
      this.processLoadedImages(data);
      this.$preloader.hide();
    }, this))
      .fail($.proxy(function () {
        this.throwLoadImagesError(2);
      }, this));
  }
  else {
    this.throwLoadImagesError(3);
  }
};

$.Editable.prototype.loadImage = function (src, info) {
  var img = new Image();
  var $li = $('<div>').addClass('f-empty');
  img.onload = $.proxy(function () {
    var delete_msg = 'Delete';
    if ($.Editable.LANGS[this.options.language]) {
      delete_msg = $.Editable.LANGS[this.options.language].translation[delete_msg];
    }

    var $img = $('<img src="' + src + '"/>');
    for (var k in info) {
      $img.attr('data-' + k, info[k]);
    }

    $li.append($img).append('<div class="f-media-title">'+ info.title +'</div>');
    $li.removeClass('f-empty');
    this.$media_images.hide();
    this.$media_images.show();
    this.triggerEvent('imageLoaded', [src], false);
  }, this);

  img.onerror = $.proxy(function () {
    $li.remove();
    this.throwLoadImagesError(1);
  }, this)

  img.src = src;
  this.$media_images.append($li);
};