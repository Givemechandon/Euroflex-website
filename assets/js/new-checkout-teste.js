/* 
#####################################################
#####################################################
######################################################
#####################################################
           
           Script para barra de etapas
                    
#####################################################
####################################################
#####################################################
#####################################################
*/



if (window.location.href.indexOf('vtex') > -1) {

    // WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
    ! function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e() : "function" == typeof define && define.amd ? define(e) : e()
    }(0, function() {
        "use strict";

        function t(t) {
            var e = $(".cabecalho-item-button");
            e.removeClass("cabecalho-item-button--active");
            for (var n = 0; n <= t; n++)
                e.eq(n).addClass("cabecalho-item-button--active");
            $("#cabecalho-steps").removeClass("cabecalho-steps--0 cabecalho-steps--1 cabecalho-steps--2 cabecalho-steps--3 cabecalho-steps--4").addClass("cabecalho-steps--" + t)
        }

        function e(e) {

            var n = {
                "#/cart": function() {
                    return t(0)
                },
                "#/email": function() {
                    return t(1)
                },
                "#/profile": function() {
                    return t(1)
                },
                "#/shipping": function() {
                    return t(2)
                },
                "#/payment": function() {
                    return t(3)
                },
                "/orderPlaced": function() {
                    return t(4)
                },
                default: function() {
                    return null
                }
            };
            return (n[e] || n.default)()
        }
        var n = function() {
                return !!("undefined" != typeof vtexjs && vtexjs.checkout && void 0 !== vtexjs.checkout && vtexjs.checkout.orderForm && void 0 !== vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.shippingData && void 0 !== vtexjs.checkout.orderForm.shippingData && vtexjs.checkout.orderForm.shippingData.logisticsInfo[0] && void 0 !== vtexjs.checkout.orderForm.shippingData.logisticsInfo[0])
            },
            o = function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            },
            i = function t(n, i) {
                o(this, t),
                    this.bind = function(t) {
                        return $(window).on("hashchange", function() {
                            return e(location.hash)
                        })
                    },
                    this.loop = function(t) {},
                    e(location.hash)
            },
            s = function() {};
        window.showSteps = function() {
                $(".cabecalho--section-secundary").show()
            },
            new function t() {
                var e = this;
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                o(this, t),
                    this.setup = function(t) {
                        e.startInterval = setInterval(function() {
                            return n() && e.start()
                        }, 200)
                    },
                    this.start = function() {
                        s(),
                            clearInterval(e.startInterval),
                            e.AllRoutes = new i(e),
                            e.bind(),
                            e.interval = setInterval(function() {
                                n() && e.hashCheck()
                            }, 1e3)
                    },
                    this.handleClassLoops = function(t) {
                        return void 0 !== t && t.loop && t.loop(e)
                    },
                    this.allCheck = function() {
                        return e.handleClassLoops(e.AllRoutes)
                    },
                    this.cartCheck = function() {
                        return e.handleClassLoops(e.CartRoute)
                    },
                    this.emailCheck = function() {
                        return e.handleClassLoops(e.EmailRoute)
                    },
                    this.profileCheck = function() {
                        return e.handleClassLoops(e.ProfileRoute)
                    },
                    this.shippingCheck = function() {
                        return e.handleClassLoops(e.ShippingRoute)
                    },
                    this.paymentCheck = function() {
                        return e.handleClassLoops(e.PaymentRoute)
                    },
                    this.orderPlacedCheck = function() {
                        return e.handleClassLoops(e.orderPlacedRoute)
                    },
                    this.hashCheck = function() {
                        switch (e.allCheck(),
                            location.hash) {
                            case "#/cart":
                                e.cartCheck();
                                break;
                            case "#/email":
                                e.emailCheck();
                                break;
                            case "#/profile":
                                e.profileCheck();
                                break;
                            case "#/shipping":
                                e.shippingCheck();
                                break;
                            case "#/payment":
                                e.paymentCheck();
                                break;
                            case "/orderPlaced":
                                e.orderPlacedCheck();
                        }
                    },
                    this.bind = function() {
                        var t = function(t) {
                            return void 0 !== t && t.bind && t.bind(e)
                        };
                        "function" == typeof i18n && i18n(),
                            t(e.CartRoute),
                            t(e.EmailRoute),
                            t(e.ProfileRoute),
                            t(e.ShippingRoute),
                            t(e.PaymentRoute),
                            t(e.orderPlacedRoute),
                            t(e.AllRoutes)
                    },
                    this.setup()
            }
    });


    //Cria o title de acordo com a etapa de compra
    function addTitleBarraEtapas() {
        var titleH2 = document.querySelector('.title--etapas h2')
        if (location.hash == '#/cart') {
            titleH2.innerHTML = "Meu carrinho"
        } else if (location.hash == '#/email' || location.hash == '#/profile') {
            titleH2.innerHTML = "Identificação"
        } else if (location.hash == '#/shipping') {
            titleH2.innerHTML = "Entrega"
        } else if (location.hash == '#/payment') {
            titleH2.innerHTML = "Pagamento"
        } else if (location.pathname.indexOf('orderPlaced') >= 1) {
            titleH2.innerHTML = "Pedido confirmado"

            var e = $(".cabecalho-item-button");
            /*   e.removeClass("cabecalho-item-button--active"); */
            for (var n = 0; n <= 4; n++)
                e.eq(n).addClass("cabecalho-item-button--active");
            $("#cabecalho-steps").addClass("cabecalho-steps--4")

        }
    }


    window.addEventListener('load', addTitleBarraEtapas)
    window.addEventListener('hashchange', addTitleBarraEtapas)


}