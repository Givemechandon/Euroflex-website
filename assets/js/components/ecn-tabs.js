APP.component.ecnTabs = VtexClass.extend({
    init: function(options) {
      this.setup(options)
      this.build()
      this.start()
    },
  
    setup: function(options) {
        this.options = $.extend({
            $scope: $('.ecn-tabs')
        }, options)
    },
    build: function(){
        let _that = this;
        this.options.$scope.each(function(){
            let _thatScope =  $(this);
            $(this).addClass('ready');

            $(this).find('.ecn-tabs__content--item').each(function(){
                let dataTitle = $(this).data('title');
                $(this).prepend(`<a href="javascript:void(0)" class="ecn-tabs__content--item--toggle">${dataTitle}</a>`);
                _that.bindMobile($(this).find('a'), _thatScope);
            });

            $(this).find('.ecn-tabs__navigation ul li').each(function(){
                _that.bindNav($(this).find('a'), _thatScope);
            });


        });
    },
  
    start: function() {
    },

    bindMobile: function(item, scope){
        $(item).on('click', function(e){
            e.preventDefault();
            $(this).toggleClass('open');
            $(this).next('.ecn-tabs__content--container').slideToggle();
        })
    },

    bindNav: function(item, scope) {
        $(item).on('click', function(e){
            e.preventDefault();
            let target = $(this).attr('href');
            $(scope).find('.ecn-tabs__navigation a').removeClass('active');
            $(this).addClass('active');
            $(scope).find('.ecn-tabs__content--item').removeAttr('data-active');
            $(scope).find(target).attr('data-active', true);
        })
    }
  })
  