Object.defineProperty(Array.prototype, "stackoverflow_removeLista", {
    enumerable: false,
    value: function (itemToRemove) {
        var removeCounter = 0;
        for (var index = 0; index < this.length; index++) {
            if (this[index] === itemToRemove) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }
        return removeCounter;
    }
});

(function( $ ){
	
	$.fn.ecnWishlist = function(options) {
        
        var _defaults = {
            class : ''
        }
		
        var settings = $.extend( {}, _defaults, options );

        var shelfId = "a576d9de-78cd-439a-ab6b-87610ce34728";
        
        
		return this.each(function() {
            
            var $_this              = $(this);

            var _verificarLogado = function () {
                window.logado = false;
                window.emailGlobal;
                window.nomeGlobal;
                for (var i = 0; i < dataLayer.length; i++) {
                    if (dataLayer[i].visitorExistingCustomer == true) {
                        if (dataLayer[i].visitorContactInfo[0] != null) {
                            window.logado = true;
                            window.emailGlobal = dataLayer[i].visitorContactInfo[0];
                            window.nomeGlobal = dataLayer[i].visitorContactInfo[1];
                        }
                    } else {
                        $('.shelf__default li .wishlist-shelf-action').fadeIn();
                    }
                    if ($('body').hasClass('product')) {
                        window.produto = dataLayer[0].productId;
                    }
                }
            }

            var _valorTotalProdutos = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        var wishlistMontarLista = data[0].wishlist;
                    }
                });
            }

            var _wishlistProductAddFrase = function () {
                console.log('[_wishlistProductAddFrase]');
                $('.product-wishlist-link').removeClass('add').addClass('remove');
                // $('.product-wishlist-link i').attr("class","icon-heart");
            }

            var _wishlistProductRemoveFrase = function () {
                $('.product-wishlist-link').removeClass('remove').addClass('add');
                $('.ecn-lightbox--wrapper--wishlist .ecn-lightbox--content--body').html('<h3>Item removido da Wishlist.</h3><p> <a href="javascript:void(0)" class="ecn-lightbox--inner--close">Voltar</a></p>');
                // $('.product-wishlist-link i').attr("class","icon-heart-o");
            }
            
            var _wishlistModalAdicionado = function () {
                // $('.ecn-lightbox--wrapper--wishlist').fadeIn();
                _wishlistProductAddFrase();
                _valorTotalProdutos();
                // setTimeout(function () {
                //     $('.ecn-lightbox--wrapper--wishlist').fadeOut();
                // }, 5000);
            }

            var _wishlistModalRemovido = function () {
                $('.ecn-lightbox--wrapper--wishlist').fadeIn();
                // $('#lightbox-wishlist')[0].open()    
                _wishlistProductRemoveFrase();
                _valorTotalProdutos();
                setTimeout(function () {
                    $('.ecn-lightbox--wrapper--wishlist').fadeOut();
                }, 5000);
            }
            
            var _wishlistAddProduct = function () {
                _verificarLogado();
                if (logado == true) {
                    $.ajax({
                        //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                        url: '/api/dataentities/CL/search',
                        type: 'GET',
                        dataType: 'json',
                        data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                        crossDomain: true,
                        headers: {
                            'Accept': 'application/vnd.vtex.ds.v10+json',
                            'Content-Type': 'application/json',
                            'REST-Range': 'resources=0-2'
                        },
                        success: function (data) {
                            window.id = data[0].id; //guardando o id capturado pelo ajax.
                            window.wishlist = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
            
                            if (window.wishlist == null) {//verifico se já existe produto cadastrado na wishlist
                                window.wishlistArray = []; //nao existe produto cadastrado no wishlist e crio o array.
                                wishlistArray.push(produto); //insiro o produto no array.
                            } else {
                                window.wishlistArray = [window.wishlist];
                                wishlistArray.push(produto);
                            }
            
                        }
                    });
            
                    setTimeout(function () {
                        $.ajax({
                            //ajax para inserir o produto na lista de desejos (wishlist).
                            url: '/api/dataentities/CL/documents/' + id + '',
                            dataType: 'json',
                            type: 'PATCH',
                            crossDomain: true,
                            data: '{"wishlist":"' + window.wishlistArray + '"}',
                            headers: {
                                'Accept': 'application/vnd.vtex.ds.v10+json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            success: function (data) {
                                _wishlistModalAdicionado(); //dispara modal de sucesso adicionado.
                            }
                        });
                    }, 1000);
                    //return false;
                } else {
                    vtexid.start(); //se não for logado, exibo modal de login.			
                    //window.location = "/login?ReturnUrl="+window.location.pathname;
                }
            }
            
            var _wishlistAddProductPrateleira = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        window.id = data[0].id; //guardando o id capturado pelo ajax.
                        window.wishlist = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
            
                        if (window.wishlist == null) {//verifico se já existe produto cadastrado na wishlist
                            window.wishlistArray = []; //nao existe produto cadastrado no wishlist e crio o array.
                            wishlistArray.push(window.productIdPrateleira); //insiro o produto no array.
                        } else {
                            window.wishlistArray = [window.wishlist];
                            wishlistArray.push(window.productIdPrateleira);
                        }
                    }
                });
            
                setTimeout(function () {
                    $.ajax({
                        //ajax para inserir o produto na lista de desejos (wishlist).
                        url: '/api/dataentities/CL/documents/' + id + '',
                        dataType: 'json',
                        type: 'PATCH',
                        crossDomain: true,
                        data: '{"wishlist":"' + window.wishlistArray + '"}',
                        headers: {
                            'Accept': 'application/vnd.vtex.ds.v10+json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        success: function (data) {
                            _wishlistModalAdicionado(); //dispara modal de sucesso adicionado.
                        }
                    });
                }, 1000);
                //return false;
            }

            var _wishlistRemoveProduct = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        window.idDelete = data[0].id; //guardando o id capturado pelo ajax.
                        var wishlistDelete = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
                        window.wishlistDeleteSplit = wishlistDelete.split(",");
            
                        $.each(window.wishlistDeleteSplit, function (index, value) {
                            if (value == window.produto) {
                                window.wishlistDeleteSplit.stackoverflow_removeLista(value);
                                return false;
                            }
                            if (window.wishlistDeleteSplit == "") {
                                window.wishlistDeleteSplit = "";
                            }
                        });
                    }
                });
                setTimeout(function () {
                    $.ajax({
                        //ajax para inserir novo array na lista de desejos (wishlist).
                        url: '/api/dataentities/CL/documents/' + idDelete + '',
                        dataType: 'json',
                        type: 'PATCH',
                        crossDomain: true,
                        data: '{"wishlist":"' + window.wishlistDeleteSplit + '"}',
                        headers: {
                            'Accept': 'application/vnd.vtex.ds.v10+json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        success: function (data) {
                            _wishlistModalRemovido(); //dispara modal de sucesso removido.
                        }
                    });
                }, 2000);
            }
            
            var _verificaProdutonaLista = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        var idVerifica = data[0].id; //guardando o id capturado pelo ajax.
                        var wishlistVerifica = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
                    
                        if (wishlistVerifica == null) {
                            // $('.product-wishlist-link').css('display','inline-block');
                            return false;
                        } else {
                            var wishlistVerificaSplit = wishlistVerifica.split(",");
                            $.each(wishlistVerificaSplit, function (index, value) {
                                // console.log('value: ', value);
                                // console.log('produto: ', produto);
                                if (value == produto) {
                                    _wishlistProductAddFrase();
                                } else {
                                    $('.product-wishlist-link').addClass('add');
                                }
                            });
                        }
                    }
                });
            }

            var _entrandoPagProduto = function () {
                _verificarLogado();
                if (logado == true) {
                    _verificaProdutonaLista();
                }
                if (logado == false) {
                    $('.product-wishlist-link').addClass('add');
                }
            }
            
            var _paginaDaLista = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        console.log('[Data]', data);
                        var wishlistMontarLista = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
                        var wishlistLength;

                        console.log('wishlistMontarLista',wishlistMontarLista);

                        if (wishlistMontarLista == null || wishlistMontarLista == "") {
                            wishlistLength = 0;
                            $('.filter-options').hide();
                            if (nomeGlobal) {
                                // $('.vitrine').html('<ul></ul>');
                                // $('.vitrine').addClass('empty').html('' + nomeGlobal + ', nenhum produto na sua Lista de Desejos :(').fadeIn();
                                $('.vitrine').addClass('empty').html('No momento, sua wishlist está vazia.').fadeIn();
                                // $('strong.carregando').fadeIn();
                                $('#ajaxBusy').hide();
                            } else {
                                // $('.vitrine').html('<ul></ul>');
                                $('.vitrine').addClass('empty').html('No momento, sua wishlist está vazia.').fadeIn();
                                $('#ajaxBusy').hide();
                            }
                            return false;
                        } else {
                            wishlistLength = wishlistMontarLista.split(",");
                            wishlistLength = wishlistLength.length;
                            $('.vitrine').hide();
                            var wishlistMontarListaSplit = wishlistMontarLista.split(',').join('&fq=productId:');
                            window.orderPrateleira = "OrderByTopSaleDESC";
                            function loadPrateleira() {
                                var urlLoad = "/buscapagina?sl="+shelfId+"&PS=1000&cc=1000&sm=0&PageNumber=1&fq=productId:" + wishlistMontarListaSplit + "&O=" + orderPrateleira + "";
                                $(".vitrine").load(urlLoad, function(){arrumaPrateleira();});
                                console.log('wishlistMontarListaSplit',wishlistMontarListaSplit)
                            }
                            loadPrateleira();
                            function arrumaPrateleira() {
                                $('.helperComplement').remove();
                                $('strong.carregando').fadeOut('fast');
                                $('.shelf__default li').each(function () {
                                    var _this = $(this);
                                    _this.find('.btn-shelf-wishlist-remove').show();
                                    _this.find('.btn-shelf-wishlist-add').hide();
                                });
                                $('.vitrine').fadeIn();

                                
                            }

                            $('.product-found').html(wishlistLength + ' produto(s)');
            
                            /*CHANGE SKU*/
                            $('.wishlist-orderby select').on('change', function () {
                                window.orderPrateleira = $('option:selected', this).val();
                                var skuThis = $('option:selected', this).text();
                                $(".vitrine").fadeOut().html('');
                                $('strong.carregando').fadeIn('fast');
                                loadPrateleira();
                            });
                        }
                    }
                });
            }
            
            var _entrandoPagLista = function () {
                console.log('entrandoPagLista');
                setTimeout(function(){
                    _verificarLogado();
                    if (logado == true) {
                        _paginaDaLista();
                        console.log('LOGADO')
                    } else {
                        vtexid.start(); //se não for logado, exibo modal de login.			
                        //window.location = "/login?ReturnUrl="+window.location.pathname;
                    }
                },2000)
            }
            
            var _removeWishlistdaPrateleira = function() {
                $('.shelf__default li .btn-shelf-wishlist-remove').live('click', function () {
                    window.idProdutoPrateleira = $(this).parents('li').find('.idProd').attr('data-id');
                    $(this).hide();
                    $(this).parents('li').find('.btn-shelf-wishlist-add').fadeIn();
                    
                    $.ajax({
                        //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                        url: '/api/dataentities/CL/search',
                        type: 'GET',
                        dataType: 'json',
                        data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                        crossDomain: true,
                        headers: {
                            'Accept': 'application/vnd.vtex.ds.v10+json',
                            'Content-Type': 'application/json',
                            'REST-Range': 'resources=0-2'
                        },
                        success: function (data) {
                            window.idDeleteLista = data[0].id; //guardando o id capturado pelo ajax.
                            var wishlistDeleteLista = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
                            window.wishlistDeleteSplitLista = wishlistDeleteLista.split(",");
            
                            $.each(window.wishlistDeleteSplitLista, function (index, value) {
                                if (value == window.idProdutoPrateleira) {
                                    window.wishlistDeleteSplitLista.stackoverflow_removeLista(value);
                                    return false;
                                }
                                if (window.wishlistDeleteSplitLista == "") {
                                    window.wishlistDeleteSplitLista = "";
                                }
                            });

            
                            
                        }
                    });
                    setTimeout(function () {
                        $.ajax({
                            //ajax para inserir novo array na lista de desejos (wishlist).
                            url: '/api/dataentities/CL/documents/' + window.idDeleteLista + '',
                            dataType: 'json',
                            type: 'PATCH',
                            crossDomain: true,
                            data: '{"wishlist":"' + window.wishlistDeleteSplitLista + '"}',
                            headers: {
                                'Accept': 'application/vnd.vtex.masterdata.v10.profileSchema+json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            success: function (data) {
                                _wishlistModalRemovido(); //dispara modal de sucesso removido.
                                
                                if($('body').hasClass('wishlist')) {
                                    _paginaDaLista();
                                }
                                setTimeout(function () {
                                    $('.ecn-lightbox--wrapper--wishlist').fadeOut();
                                }, 5000);
                            }
                        });

                        
                    }, 2000);
                });//remover produto da lista de desejos ao clicar no botão de remover na pag de minha lista.
            }
            
            var _adicionaWishlistdaPrateleira = function() {
                $('.shelf__default li .btn-shelf-wishlist-add').live('click', function () {
                    console.log('Click');
                    _verificarLogado();
                    if (logado == true) {
                        window.productIdPrateleira = $(this).parents('li').find('.idProd').attr('data-id');
                        _wishlistAddProductPrateleira();
                        $(this).hide();
                        $(this).parents('li').find('.btn-shelf-wishlist-remove').fadeIn();
                    } else {
                        vtexid.start();
                        //window.location = "/login?ReturnUrl="+window.location.pathname;
                        //$(window).scrollTop(0);
                    }
                })
            }

            var _wishlistModalRemovidoLista = function () {
                $('#lightbox-cart .wishlist-modal-removed').show();
                $('#lightbox-cart .wishlist-modal-added').hide();
                $('.page-wishlist #lightbox-cart').show();
                $('.prateleira_get').html('');
                $('.prateleira').html('<ul></ul>');
                $('strong.carregando').fadeIn('fast');
                _paginaDaLista();
                _valorTotalProdutos();
            }

            var _verificaLogadoQualquerPag = function () {
                setTimeout(function(){
                    _verificarLogado();
                    if (logado == true) {
                        _verificaProdutonaListaPrateleiraSite();
                        _valorTotalProdutos();
                    }
                },2000)
            }
            
            var _verificaProdutonaListaPrateleiraSite = function () {
                $.ajax({
                    //ajax para buscar id do usuário. Utilizando o e-mail guardado anteriormente.
                    url: '/api/dataentities/CL/search',
                    type: 'GET',
                    dataType: 'json',
                    data: { "_fields": "id,wishlist", "_where": "email=" + emailGlobal },
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json',
                        'REST-Range': 'resources=0-2'
                    },
                    success: function (data) {
                        if (data.length === 0) {
                            $.ajax({
                                url: '/api/dataentities/CL/documents',
                                dataType: 'json',
                                type: 'POST',
                                crossDomain: true,
                                data: '{"email":"' + emailGlobal + '"}',
                                headers: {
                                    'Accept': 'application/vnd.vtex.ds.v10+json',
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                success: function (data) {
                                    console.log(data);
                                    //_verificaProdutonaListaPrateleiraSite();
                                }
                            });
                        } else {
                            var idVerifica = data[0].id; //guardando o id capturado pelo ajax.
            
                            if (data[0].wishlist == null) {
                                $('.shelf__default li').find('.btn-shelf-wishlist-add').fadeIn();
                            } else {
                                var wishlistVerifica = data[0].wishlist; //guardando o campo wishlist capturado pelo ajax.
                                var wishlistVerificaSplit = wishlistVerifica.split(",");
                                var wishlistLength = wishlistVerificaSplit.length;

                                $('.wish-amount').text(wishlistLength);
            
                                $('.shelf__default li').each(function () {
                                    var _this = $(this);
                                    var produtoPrateleira = _this.find('.idProd').attr('data-id');
                                    $.each(wishlistVerificaSplit, function (index, value) {
                                        if (value == produtoPrateleira) {
                                            _this.find('.btn-shelf-wishlist-add').hide();
                                            _this.find('.btn-shelf-wishlist-remove').show();
                                        } else {
                                        }
                                    });
                                });
                            }
                        }
                    }
                });
            }
            
            this["verificarLogado"]                         = _verificarLogado;
            this["valorTotalProdutos"]                      = _valorTotalProdutos;
            this["wishlistProductAddFrase"]                 = _wishlistProductAddFrase;
            this["wishlistProductRemoveFrase"]              = _wishlistProductRemoveFrase;
            this["wishlistModalAdicionado"]                 = _wishlistModalAdicionado;
            this["wishlistModalRemovido"]                   = _wishlistModalRemovido;
            this["wishlistAddProduct"]                      = _wishlistAddProduct;
            this["wishlistAddProductPrateleira"]            = _wishlistAddProductPrateleira;
            this["wishlistRemoveProduct"]                   = _wishlistRemoveProduct;
            this["verificaProdutonaLista"]                  = _verificaProdutonaLista;
            this["entrandoPagProduto"]                      = _entrandoPagProduto;
            this["paginaDaLista"]                           = _paginaDaLista;
            this["entrandoPagLista"]                        = _entrandoPagLista;
            this["removeWishlistdaPrateleira"]              = _removeWishlistdaPrateleira;
            this["adicionaWishlistdaPrateleira"]            = _adicionaWishlistdaPrateleira;
            this["wishlistModalRemovidoLista"]              = _wishlistModalRemovidoLista;
            this["verificaLogadoQualquerPag"]               = _verificaLogadoQualquerPag;
            this["verificaProdutonaListaPrateleiraSite"]    = _verificaProdutonaListaPrateleiraSite;
        })
    };
    
})( jQuery );