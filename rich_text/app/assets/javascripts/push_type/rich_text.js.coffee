# This is a manifest file that'll be compiled into application.js, which will include all the files
# listed below.
#
# Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
# or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
#
# It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
# compiled file.
#
# Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
# about supported directives.
#
#= require froala_editor.min
#= require plugins/lists.min
#= require plugins/file_upload.min
#= require plugins/media_manager.min
#= require plugins/video.min
#= require_self
#= require_tree .

# jQuery init
$(document).on 'ready page:load', ->

  $('textarea.froala', '.rich_text').editable
    inlineMode:       false
    buttons:          ['bold', 'italic', 'underline', 'sep', 'formatBlock', 'align', 'insertOrderedList', 'insertUnorderedList', 'sep', 'createLink', 'insertImage', 'uploadFile', 'insertVideo', 'table', 'sep', 'removeFormat', 'undo', 'redo', 'sep' ,'html']
    blockTags:
      n:  'Normal'
      h1: 'Heading 1'
      h2: 'Heading 2'
    height:           400
    imagesLoadURL:    '/push_type/froala_media/images'
    imageUploadURL:   '/push_type/froala_media'
    imageUploadParam: 'asset[file]'
    theme:            'pt'

  $('textarea.froala', '.rich_text').on 'editable.focus', (e, editor) ->
    editor.$box.addClass 'focus'

  $('textarea.froala', '.rich_text').on 'editable.blur', (e, editor) ->
    editor.$box.removeClass 'focus'

  $('textarea.froala', '.rich_text').on 'editable.imageError', (e, editor, error) ->
    alert error.message