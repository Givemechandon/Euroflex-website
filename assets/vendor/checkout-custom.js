var ECNCheckout = {	
	setCookie: function(name,value,days) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	},
	getCookie: function(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	},
	checkLocation: function(orderForm) {
		var _this = this	
		if (orderForm && orderForm.shippingData && orderForm.shippingData.address) {
			let UF = orderForm.shippingData.address.state
			let states = ['RJ', 'SP', 'MG']
			let currentRegion = _this.getCookie('ECNselectedState')						

			if (states.indexOf(UF) == -1) {
				UF = 'OE'
			}									

			if (UF != currentRegion)	{
				_this.setCookie('ECNselectedState', UF, {
          expires: 1
        });
        vtexjs.checkout.addToCart([{ id: 0, quantity: 1, seller: 1 }], null, (UF == 'SP') ? 1 : 2)
			}
		}
	},
	bindSeal: function() {
		var tags = '<div id="armored_website" class="seal_armored_website">\
					<param id="aw_preload" value="true" />\
					<param id="aw_use_cdn" value="true" />\
				</div>\
				<script type="text/javascript" src="//cdn.siteblindado.com/aw.js"></script>';
		$('.header__checkout--wrapper .container #targetSeal').html(tags);
	}
}

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {			
	ECNCheckout.checkLocation(orderForm);
	ECNCheckout.bindSeal();
});
