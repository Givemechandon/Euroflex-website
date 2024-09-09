APP.component.flagDiscount = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $BODY: $('body'),
            $scope: $('.shelf__default'),
            class: '',

        }, options)
    },

    start: function () {
        this._buildFlag();

        $(document).ajaxStop(() => {
            this._buildnewFlag();
            this._buildFlag();
          });
    },


    _buildnewFlag: function() {

        let newFlags =  $('<div/>', {class:'shelf__default--highlight-newFlags'})
        let shelfItems = $('.shelf__default > ul > li, .shelf__default .slick-slide > div > li');

        shelfItems.each(function() {
          if($(this).find('.shelf__default--highlight-newFlags').length == 0) {
            console.log('entrou')
            $(this).find('.shelf__default--image a').append(newFlags);
          }

          let el = $(this).find('.shelf__default--highlight');
          let flags = el.find('.shelf__default--highlight-flags p')
          let discounts = el.find('.shelf__default--highlight-discount-percentage')
          let partn = el.parent().find('.shelf__default--highlight-newFlags')
          
          let elDiscount = $(discounts)
          var descpct = elDiscount.text().replace(',', '.');
          descpct = descpct.replace(' %', '');
          descpct = parseFloat(descpct);
          descpct = descpct.toFixed(0);

          if(!elDiscount.hasClass('ready')){
              if ((descpct == "0") || (descpct == 0)) {
                  elDiscount.hide();
              } else {
                  elDiscount.show().addClass("active");
                  elDiscount.html("<span> -" + descpct + "%</span>");
              }
          }

          elDiscount.addClass('ready')

          discounts.clone().appendTo(partn)
          flags.appendTo(partn)
        });

    },

    _buildFlag: function () {
        
        this.options.$scope.find('.shelf__default--highlight-discount-percentage').each(function () {
            var descpct = $(this).text().replace(',', '.');
            descpct = descpct.replace(' %', '');
            descpct = parseFloat(descpct);
            descpct = descpct.toFixed(0);
            
            if(!$(this).hasClass('ready')){
                if ((descpct == "0") || (descpct == 0)) {
                    $(this).hide();
                } else {
                    $(this).show().addClass("active");
                    $(this).html("<span> -" + descpct + "%</span>");
                }
            }

            $(this).addClass('ready')
        });
    },
    bind: function () {
    }
})
