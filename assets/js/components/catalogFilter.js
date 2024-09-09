APP.component.catalogFilter = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $BODY: $('body'),
            $scope: $('.catalog__navigator--wrapper'),
            class: '',

        }, options)
    },

    start: function () {
        this._groupFiltersCategories()
        this._groupFiltersToggle()
        this._menuFilterToggle()
     },

    _textItemDepartament: function(element) {
        var regexpItens = /\({1}([0-9])*?\){1}/g;
        for (var i = 0; i < element.length; i++) {
            var newText = $(element[i]).text().replace(regexpItens, "");
            $(element[i]).text(newText);
        };
    },

     _groupFiltersCategories: function () {
        this._textItemDepartament(this.options.$scope.find('h4 a'));
        
        //Agrupar filtros de categoria
        this.options.$scope.find(".search-single-navigator h4").next("ul").remove();
        this.options.$scope.find(".search-single-navigator h4").wrapAll("<fieldset class='filterCategory'></fieldset>");
        $(".filterCategory").prepend("<h5>Categorias</h5>");
        $(".filterCategory h4").wrapAll("<div></div>");
        $(".filterCategory").prependTo(".search-multiple-navigator");
        
        this.options.$scope.fadeIn();
    },

    _groupFiltersToggle:  function () {
        this.options.$scope.find('fieldset > h5').off('click').on('click', function (e) {
            e.preventDefault();
            if ($(this).parent().hasClass("active")) {
                $(this).parent().removeClass("active");
                $(this).removeClass("active");
            } else {
                $('fieldset > h5').parent().removeClass("active");
                $(this).parent().addClass("active");
                $(this).addClass("active");
            }
        })      
        
        this.options.$scope.find('.search-single-navigator > h3').off('click').on('click',  function (e) {
            e.preventDefault();
            $(this).toggleClass('active');
            $(this).parent().toggleClass("active");

        })
    },

    _menuFilterToggle: function () {
        // Open Menu
        $('.filterMobileToggle').off('click').on('click', function (e) {
            if (fns.verifyWidth()) {
                e.preventDefault();
                $('.navTopbar').addClass('open');
                $('body').addClass('menuOpen');
                $('.navOverlay').addClass('active');
            }
        })
        
        //Close Menu
        $('.navTopbarHead .icon-close, .navOverlay').off('click').on('click', function (e) {
            if (fns.verifyWidth()) {
                e.preventDefault();
                $('.navTopbar').removeClass('open');
                $('body').removeClass('menuOpen');
                $('.navOverlay').removeClass('active');
            }
        })
    },

    bind: function () {
    }
  })
