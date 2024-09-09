APP.component.ecnLocation = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.build()
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $scope: $('.ecn-lightbox--wrapper--locate-popup'),
            $selector: $('.js-change--region'),
            $modalList: $('#seletor-de-regiao')
        }, options)
    },
    build: function () {
        this.changeLocation();
    },

    verifyLocation: function () {
        let selectedState = Cookies.get('ECNselectedState');

        if (!selectedState) {
            this.options.$scope.fadeIn();
        } else {
            this.options.$selector.text($('#seletor-de-regiao option[value="' + selectedState + '"]').text());
            this.options.$modalList.val(selectedState).change();
        }
    },

    _simulation: function (_sc, clearShipping) {
        let items = [{ id: 0, quantity: 1, seller: 1 }]
        //Gambiarra para alterar o Seller no orderform
        console.log("sales channel alterado") ;
        // Limpa CEP atual no cart
        if (clearShipping == 'true') {
            vtexjs.checkout.calculateShipping().done(function(){
                vtexjs.checkout.addToCart(items, null, _sc).done(function (o, s) { 
                    window.location = window.location.pathname + '?sc=' + _sc;
                })
            })
        } else {
            vtexjs.checkout.addToCart(items, null, _sc).done(function (o, s) { 
                window.location = window.location.pathname + '?sc=' + _sc;
            })
        }
    },
    changeLocation: function () {
        let _that = this;

        this.options.$scope.find('form').on('submit', function (e) {
            e.preventDefault();
            let region = $(this).find('select  option:selected').text();
            let UF = $(this).find('select').val();
            let clearShipping = $(this).find('#clear-shipping').val();
            console.log(region);
            _that.options.$scope.fadeOut();
            _that.options.$selector.text(region);

            if (region === 'São Paulo') {
                // window.location = '/?sc=2';
                _that._simulation(1, clearShipping);
            } else {
                _that._simulation(1, clearShipping);
            }
            
            Cookies.set('ECNselectedState', UF, {
                expires: 1
            });
        })
    },

    bind: function () {
        let _that = this;
        this.options.$selector.on('click', function (e) {
            e.preventDefault();
            _that.options.$scope.fadeIn();
        });
    },

    start: function () {
        $('#seletor-de-regiao').select2()
        this.verifyLocation()
    },

})
