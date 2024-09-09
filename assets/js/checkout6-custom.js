var ECNCheckout = {
	setCookie: function (name, value, days) {
		var expires = ""
		if (days) {
			var date = new Date()
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
			expires = "; expires=" + date.toUTCString()
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/"
	},
	getCookie: function (name) {
		var nameEQ = name + "="
		var ca = document.cookie.split(";")
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i]
			while (c.charAt(0) == " ") c = c.substring(1, c.length)
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length)
		}
		return null
	},
	checkLocation: function (orderForm) {
		var _this = this
		if (
			orderForm &&
			orderForm.shippingData &&
			orderForm.shippingData.address
		) {
			let UF = orderForm.shippingData.address.state
			let states = ["RJ", "SP", "MG"]
			let currentRegion = _this.getCookie("ECNselectedState")

			if (states.indexOf(UF) == -1) {
				UF = "OE"
			}

			if (UF != currentRegion) {
				_this.setCookie("ECNselectedState", UF, {
					expires: 1,
				})
				vtexjs.checkout.addToCart(
					[{ id: 0, quantity: 1, seller: 1 }],
					null,
					UF == "SP" ? 1 : 2
				)
			}
		}
	},
	bindSeal: function () {
		var tags =
			'<div id="armored_website" class="seal_armored_website">\
					<param id="aw_preload" value="true" />\
					<param id="aw_use_cdn" value="true" />\
				</div>\
				<script type="text/javascript" src="//cdn.siteblindado.com/aw.js"></script>'
		$(".header__checkout--wrapper .container #targetSeal").html(tags)
	},
}

$(window).on("load", function () {
	$("#shipping-calculate-link").click()
})

$(window).on("orderFormUpdated.vtex", function (evt, orderForm) {
	// ECNCheckout.checkLocation(orderForm)
	ECNCheckout.bindSeal()
})

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

// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
!(function (t, e) {
	"object" == typeof exports && "undefined" != typeof module
		? e()
		: "function" == typeof define && define.amd
		? define(e)
		: e()
})(0, function () {
	"use strict"

	function t(t) {
		var e = $(".cabecalho-item-button")
		e.removeClass("cabecalho-item-button--active")
		for (var n = 0; n <= t; n++)
			e.eq(n).addClass("cabecalho-item-button--active")
		$("#cabecalho-steps")
			.removeClass(
				"cabecalho-steps--0 cabecalho-steps--1 cabecalho-steps--2 cabecalho-steps--3 cabecalho-steps--4"
			)
			.addClass("cabecalho-steps--" + t)
	}

	function e(e) {
		var n = {
			"#/cart": function () {
				return t(0)
			},
			"#/email": function () {
				return t(1)
			},
			"#/profile": function () {
				return t(1)
			},
			"#/shipping": function () {
				return t(2)
			},
			"#/payment": function () {
				return t(3)
			},
			"#/orderplaced": function () {
				return t(4)
			},
			default: function () {
				return null
			},
		}
		return (n[e] || n.default)()
	}
	var n = function () {
			return !!(
				"undefined" != typeof vtexjs &&
				vtexjs.checkout &&
				void 0 !== vtexjs.checkout &&
				vtexjs.checkout.orderForm &&
				void 0 !== vtexjs.checkout.orderForm &&
				vtexjs.checkout.orderForm.shippingData &&
				void 0 !== vtexjs.checkout.orderForm.shippingData &&
				vtexjs.checkout.orderForm.shippingData.logisticsInfo[0] &&
				void 0 !==
					vtexjs.checkout.orderForm.shippingData.logisticsInfo[0]
			)
		},
		o = function (t, e) {
			if (!(t instanceof e))
				throw new TypeError("Cannot call a class as a function")
		},
		i = function t(n, i) {
			o(this, t),
				(this.bind = function (t) {
					return $(window).on("hashchange", function () {
						return e(location.hash)
					})
				}),
				(this.loop = function (t) {}),
				e(location.hash)
		},
		s = function () {}
	;(window.showSteps = function () {
		$(".cabecalho--section-secundary").show()
	}),
		new (function t() {
			var e = this
			arguments.length > 0 && void 0 !== arguments[0] && arguments[0]
			o(this, t),
				(this.setup = function (t) {
					e.startInterval = setInterval(function () {
						return n() && e.start()
					}, 200)
				}),
				(this.start = function () {
					s(),
						clearInterval(e.startInterval),
						(e.AllRoutes = new i(e)),
						e.bind(),
						(e.interval = setInterval(function () {
							n() && e.hashCheck()
						}, 1e3))
				}),
				(this.handleClassLoops = function (t) {
					return void 0 !== t && t.loop && t.loop(e)
				}),
				(this.allCheck = function () {
					return e.handleClassLoops(e.AllRoutes)
				}),
				(this.cartCheck = function () {
					return e.handleClassLoops(e.CartRoute)
				}),
				(this.emailCheck = function () {
					return e.handleClassLoops(e.EmailRoute)
				}),
				(this.profileCheck = function () {
					return e.handleClassLoops(e.ProfileRoute)
				}),
				(this.shippingCheck = function () {
					return e.handleClassLoops(e.ShippingRoute)
				}),
				(this.paymentCheck = function () {
					return e.handleClassLoops(e.PaymentRoute)
				}),
				(this.orderPlacedCheck = function () {
					return e.handleClassLoops(e.orderPlacedRoute)
				}),
				(this.hashCheck = function () {
					switch ((e.allCheck(), location.hash)) {
						case "#/cart":
							e.cartCheck()
							break
						case "#/email":
							e.emailCheck()
							break
						case "#/profile":
							e.profileCheck()
							break
						case "#/shipping":
							e.shippingCheck()
							break
						case "#/payment":
							e.paymentCheck()
							break
						case "#/orderplaced":
							e.orderPlacedCheck()
					}
				}),
				(this.bind = function () {
					var t = function (t) {
						return void 0 !== t && t.bind && t.bind(e)
					}
					"function" == typeof i18n && i18n(),
						t(e.CartRoute),
						t(e.EmailRoute),
						t(e.ProfileRoute),
						t(e.ShippingRoute),
						t(e.PaymentRoute),
						t(e.orderPlacedRoute),
						t(e.AllRoutes)
				}),
				this.setup()
		})()
})

//Cria o title de acordo com a etapa de compra
function addTitleBarraEtapas() {
	var titleH2 = document.querySelector(".title--etapas h2")
	if (location.hash == "#/cart") {
		titleH2.innerHTML = "Meu carrinho"
	} else if (location.hash == "#/email" || location.hash == "#/profile") {
		titleH2.innerHTML = "Identificação"
	} else if (location.hash == "#/shipping") {
		titleH2.innerHTML = "Entrega"
	} else if (location.hash == "#/payment") {
		titleH2.innerHTML = "Pagamento"
	} else if (location.hash == "#/orderplaced") {
		titleH2.innerHTML = "Pedido confirmado"
	}
}

window.addEventListener("load", addTitleBarraEtapas)
window.addEventListener("hashchange", addTitleBarraEtapas)

$(window).on("load", function () {
  document.querySelector(".ht-skip").remove()
	new HT({
		token: "85540aa8023a9462ed36ba4bfcbc05b6",
		avatar: "MAYA",
		textEnabled: true,
		pageSpeech: true,
	})
})
