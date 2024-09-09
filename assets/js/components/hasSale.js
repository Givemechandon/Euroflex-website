APP.component.hasSale = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $scope: $('.shelf__default'),
            $class: 'has-no-sale',

        }, options)
    },

    start: function () {
        this._initHasSale();

        $(document).ajaxStop(() => {
            this._initHasSale();
        });
    },

    _addToCart: function (item, _sc) {
      
        vtexjs.checkout.addToCart([item], null, _sc)
            .done(function (orderForm) {
                $('body').addClass('minicart-is-open');
                console.log('Adicionado ao carrinho', orderForm);
            }).fail(function (jqXHR, textStatus, msg) {
                console.error('Ocorreu um erro ao adicionar ao carrinho')
            });
    },

    _initHasSale: function () {
        let _that = this;
        this.options.$scope.find('.product_field_437').each(function () {

            if (!$(this).hasClass('ready')) {
                $(this).parents('li').find('.shelf__default--wrapper').addClass(_that.options.$class)
                console.log('has-sale')
            }

            $(this).addClass('ready')
        });

        $(document).find('.buy-btn').each(function () {

            if (!$(this).hasClass('ready')) {
                $(this).on('click', function (e) {
                    e.preventDefault();

                    function getParam(url) {
                        var result = {};

                        url.replace(/([^\?=&]+)=([^&]+)/g, function (match, key, val) {
                            result[key] = decodeURIComponent((val + '').replace(/\+/g, '%20'));
                        });

                        return result;
                    }
                    let url = $(this).parents('.shelf__default--buy').find('a').attr('href');

                    console.log('getParam(url)', getParam(url))
                    let sku = getParam(url).sku;
                    let qty = getParam(url).qty;
                    let seller = getParam(url).seller || 1;
                    let _sc = getParam(url).sc;

                    var item = {
                        id: sku,
                        quantity: qty,
                        seller: seller
                      };

                    _that._addToCart(item, _sc)
                });

                $(this).addClass('ready')
            }

        });

    },
    bind: function () {
    }
})
