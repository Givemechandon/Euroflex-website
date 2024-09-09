

APP.component.gridControl = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $BODY: $('body'),
            $scope: $('.catalog__grid-control'),
            class: '',

        }, options)
    },

    start: function () {
        this._setGrid();
        this.options.$scope.addClass('show');
    },

    bind: function () {
        $('.catalog__grid-control').on('click', '.catalog__grid-control--first', function (e) {
            e.preventDefault();
            if (window.localStorage) {
                $('html').removeClass('view-mode2');
                localStorage.setItem('gridControl', 'four-columns');
                $('.catalog__grid-control').find('a').removeClass('active');
                $(this).addClass('active');
            }
        });

        $('.catalog__grid-control').on('click', '.catalog__grid-control--second', function (e) {
            e.preventDefault();
            if (window.localStorage) {
                $('html').addClass('view-mode2');
                localStorage.setItem('gridControl', 'view-mode2');
                $('.catalog__grid-control').find('a').removeClass('active');
                $(this).addClass('active');
            }
        });
    },
    _setGrid: function () {
        if (window.localStorage) {
            // verifica se possui a variavel de controle de GRID
            if (localStorage.getItem('gridControl') == 'view-mode2') {
                $('html').addClass('view-mode2');
                $('.catalog__grid-control').find('.catalog__grid-control--second').addClass('active');
            } else {
                $('.catalog__grid-control').find('.catalog__grid-control--first').addClass('active');
            }
        }
    }
})
