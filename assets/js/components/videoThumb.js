APP.component.videoThumb = VtexClass.extend({
  init: function (options) {
    this.setup(options)
    this.manageContent()
    this.bindEvents()
  },

  setup: function (options) {
    this.options = $.extend({
        fieldClass: '.Video',
        width: 500,
        height: 500,
        thumb: '/arquivos/thumb-video.png',
        positionThumb: 'bottom' //top
    }, options)
  },


  manageContent: function() {
      var fieldClass = this.options.fieldClass.replace('.',''),
          video = $('.value-field.'+fieldClass).html(),
          //video = 'https://www.youtube.com/watch?v=zRxGRX6VrxU',
          that = this;

      if (video && (video.indexOf('youtube') > -1 || video.indexOf('youtu.be') > -1)) {
          $('.value-field.'+fieldClass+', .name-field.'+fieldClass).hide();
          $('.thumbs a').first().click();
          $('.videoWrapper').remove();
          $('#include').append('<div class="videoWrapper" style="display:none;"><iframe width="'+that.options.width+'" height="'+that.options.height+'" src="" frameborder="0" allowfullscreen="" allowtransparency="true"></iframe></div>');
          $('.value-field.'+fieldClass).each(function() {
              var src = $(this).html();
              if(src.indexOf('youtube') > -1) {
                  src = ( $(this).find('iframe').length > 0 ? $(this).find('iframe').attr('src') : 'https://www.youtube.com/embed/'+src.split('v=').reverse()[0] )
              }
              else {
                  src = ( $(this).find('iframe').length > 0 ? $(this).find('iframe').attr('src') : 'https://www.youtube.com/embed/'+src.split('/').reverse()[0] )
              }
              var listItem = '<li class="trigger-video" style="cursor:pointer;"><img rel="' + src + '" src="'+that.options.thumb+'" /></li>'

              switch (that.options.positionThumb) {
                  case 'top':
                      $('.thumbs').prepend(listItem);
                      break;
                  default:
                      $('.thumbs').append(listItem);
              }
          });
      }
  },

  bindEvents: function() {
      $('li.trigger-video').bind("click", function() {
          $('#include div#image').hide();
          var newRel = $(this).find('img').attr('rel'),
              rel = $('#include .videoWrapper iframe').attr('src');
          if(newRel !== rel){
              $('#include .videoWrapper iframe').attr('src', newRel);
          }
          if(!$('#include .videoWrapper').is(':visible')){
              $('#include .videoWrapper').fadeIn();
          }
          $('.ON').removeClass('ON');
          $(this).find('img').addClass('active');
      });

      $('ul.thumbs li a').live('click', function() {
          $('li.trigger-video img').removeClass('active');
          $('#include .videoWrapper').hide();
          $('#include div#image').fadeIn();
      });

      // Iniciando o thumb com o vÃ­deo ativado
      // $('li.trigger-video').click();
      $('.apresentacao').addClass('video-initialized');

      // CorreÃ§Ã£o para o thumb inicial da Vtex que recebe a class ON apÃ³s a execuÃ§Ã£o do mÃ³dulo videoThumb
      if($('.apresentacao').find('iframe').length > 0) {
          $(document).one('ajaxStop', function() {
              $('.ON').removeClass('ON');
          });
      }
  }

})
