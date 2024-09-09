

APP.component.progressiveLoad = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $scope: $('.shelf__default')
        }, options)
    },

    start: function () {
        this._initLoading();

        $(document).ajaxStop(() => {
            this._initLoading();
          });
    },

    _initLoading: function () {
        $('.shelf__default--image img').on('load', function() {
            // Sucesso
            // console.log('load');
            $(this).parents('.shelf__default--wrapper').addClass('img-load');
        }).on('error', function() {
            // Erro
            $(this).attr('src', '/arquivos/image-not-found.png');
            // console.log('error')
        }).each(function() {
            if (this.complete) {
                $(this).load();
            } else if (this.error) {
                $(this).error();
            }
        });
        
    },
    bind: function () {
    }
})
