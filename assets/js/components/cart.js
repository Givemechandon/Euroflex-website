APP.component.Cart = VtexClass.extend({

	formatMoney: function (e, c, d, t) {
		if(e === null) return '<span class="unavailable">Indisponível</span>';
		e = e.toString();
		if (e.indexOf('.') < 0 && e.indexOf(',') < 0) {
			e = e.substr(0, e.length - 2) + '.' + e.substr(-2);
		}

		var n = e,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "." : d,
			t = t == undefined ? "," : t,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return 'R$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	},

	valorTotalFreteGratis: function (orderForm) {
		var _that = this;
		var faltamTotalFrete, valorTotalMinicart, valorTotalFrete, valorFaltaMinicart;

		valorTotalFrete = 399;
		faltamTotalFrete = 0;

		if (orderForm.totalizers.length > 0) {




			valorTotalMinicart = orderForm.totalizers[0].value;
			valorTotalMinicart = valorTotalMinicart / 100;


			var fretePercent = (100 * valorTotalMinicart) / valorTotalFrete;
			fretePercent > 100 ? fretePercent = 100 : false;

			$(document).find('.minicart-header__calculoFrete-percent').html('<div style="width: ' + fretePercent.toFixed(0) + '%"></div>');

			if (valorTotalMinicart >= valorTotalFrete) {
				$('.minicart-header__calculoFrete-frase').html('Oba, você ganhou <span>frete grátis</span>!');
			} else {
				valorFaltaMinicart = (valorTotalFrete - valorTotalMinicart) * 100;
				if ($('.minicart-header__calculoFrete-frase span').length < 1) {
					$('.minicart-header__calculoFrete-frase').html('Faltam <span style="minicart-header__calculoFrete-valor">' + _that.formatMoney(valorFaltaMinicart) + '</span> para você ganhar <span>frete grátis</span>!')
				}
				$('.minicart-header__calculoFrete-frase span').text(_that.formatMoney(valorFaltaMinicart));
			}

		} else {
			$('.minicart-header__calculoFrete-frase span').text('399');
		}
	},

	criandoMinicart: function (orderForm) {
		var _that = this;
		var body = $('body');
		if ($('#minicartLateral').length == 0) {
			body.append('<div id="minicartLateral">' +
				'   <div class="minicart-info">' +
				'       <div class="minicart-header">' +
				'           <button class="minicart-header__btnClose"></button>' +
				'           <div class="minicart-header__titulo">Carrinho <span class="amount-items-em">0</span></div>' +
				'           <div class="minicart-header__calculoFrete" style="display: none;">' +
				'             <div class="minicart-header__calculoFrete-frase">Faltam <span style="minicart-header__calculoFrete-valor">399</span> para você ganhar frete grátis</div>' +
				'             <div class="minicart-header__calculoFrete-percent"></div>' +
				'           </div>' +
				'       </div>' +
				'       <div class="minicart-items"></div>' +
				'       <div class="minicart-footer">' +
				'         <div class="minicart-footer__subtotal"> ' +
				'           <div class="minicart-footer__subtotal-frase">Subtotal</div>' +
				'           <div class="minicart-footer__subtotal-valor"> 0,00</div>' +
				'          </div>' +
				'         <div class="minicart-footer__infoCheckout">' +
				'           <div class="minicart-footer__infoCheckout-blocoCep">' +
				'             <span class="minicart-footer__infoCheckout-blocoCep__frase">Frete</span>' +
				'             <div class="minicart-footer__infoCheckout-blocoCep__cepCalculado">' +
				'               <span class="minicart-footer__infoCheckout-blocoCep__cepCalculado-content">' +
				'                 <span class="minicart-footer__infoCheckout-blocoCep__cepCalculado-frase">CEP: </span>' +
				'                 <span class="minicart-footer__infoCheckout-blocoCep__cepCalculado-numeroCep"> </span>' +
				'                 <span class="minicart-footer__infoCheckout-blocoCep__cepCalculado-excluir"></span>' +
				'               </span>' +
				'             </div>' +
				'             <div class="minicart-footer__infoCheckout-blocoCep__formCep">' +
				'               <input type="text" id="cepMinicart" class="minicart-footer__infoCheckout-blocoCep__formCep-cepMinicart" placeholder="CEP"/>' +
				'               <button type="submit" class="minicart-footer__infoCheckout-blocoCep__formCep-calculaFrete">Adicionar</button>' +
				'             </div>' +
				'             <strong class="minicart-footer__infoCheckout-blocoCep__formCep-freteCalculado"> 0,00</strong>' +
				'           </div>' +
				'         </div>' +
				'         <div class="minicart-footer__total"> ' +
				'           <div class="minicart-footer__total-frase">Total</div> ' +
				'           <div class="minicart-footer__total-valor"> 0,00</div> ' +
				'         </div>' +
				'         <div class="minicart-footer__botaoFinalizarPedido">' +
				'           <a href="/" class="checkout">ESCOLHER MAIS PRODUTOS</a>' +
				'           <a href="/checkout/#/cart" class="place-order">IR PARA O CARRINHO</a>' +
				'         </div>' +
				'       </div>' +
				'   </div>' +
				'</div>');
			_that.atualizandoMinicart(orderForm);
			_that.tamanhoImgMinicart();
		}
	},

	atualizandoMinicart: function (orderForm) {
		var _that = this;
		var minicartItems = $('.minicart-items');
		var quantidade = 0;

		if (orderForm.items.length > 0) {
			$('.amount-items-em').text(orderForm.items.length)
			// $(orderForm.items).each(function (i, v) {
			// 	quantidade = $('.header-topo__right--this.header-controls .amount-items-em').text();
			// 	$('.minicart-header__titulo .amount-items-em').text(quantidade);
			// })
		} else {
			$('.amount-items-em').text('0');
		}
		if (orderForm.items.length > 0) {
			if (orderForm.totalizers[0] != undefined) {
				$('.minicart-footer__subtotal-valor').html(_that.formatMoney(orderForm.totalizers[0].value));
			}
		} else {
			$('.minicart-header .amount-items-em').text('0');
			$('.minicart-footer__subtotal-valor').text(' 0,00');
		}

		if (orderForm.totalizers.length) {
			orderForm.totalizers.map(function (valor, index) {
				var valorTotais =  _that.formatMoney(valor.value, 2, ',', '.');
				if (valor.id === 'Items') {
					$('.minicart-footer__subtotal-valor').html(valorTotais);
				}
				if (valor.id === 'Shipping') {
					valorTotais = valor.value > 0 ? valorTotais : 'Grátis';
					var cepUsado = orderForm.shippingData.address.postalCode;
					// $('.minicart-footer__infoCheckout-blocoCep__formCep, .minicart-footer__infoCheckout-blocoCep__frase ').hide();
					$('.minicart-footer__infoCheckout-blocoCep__formCep-calculaFrete').removeClass('ativo');
					$('.minicart-footer__infoCheckout-blocoCep__cepCalculado').show();
					$('.minicart-footer__infoCheckout-blocoCep__formCep-freteCalculado').text(valorTotais).show();
					$('.minicart-footer__infoCheckout-blocoCep__formCep').hide();
					console.log('passou');
					if (!$('.recalcular').length < 1) {
						$('.form-cep').append('<span clas="cep-usado">' + cepUsado + '</span><span class="recalcular">Recalcular CEP</span>');
					} else {
						$('.minicart-footer__infoCheckout-blocoCep__cepCalculado-numeroCep').text(cepUsado)
						$('.form-cep span').show()
					}
					_that.freteBtnRecalcularMinicart();
				}
			})
		}

		var totalCompra = _that.formatMoney(orderForm.value, 2, ',', '.');
		$(".minicart-footer__total-valor").text(totalCompra);

		minicartItems.html('');
		if (orderForm.items.length) {
			for (var x = 0; x < orderForm.items.length; x++) {
				var minicartCadaItem = orderForm.items[x];

				var price = '';
				var de =  _that.formatMoney(minicartCadaItem.listPrice, 2, ',', '.');
				var por =  _that.formatMoney(minicartCadaItem.sellingPrice, 2, ',', '.');
				var link = minicartCadaItem.detailUrl;
				if (minicartCadaItem.listPrice > minicartCadaItem.sellingPrice) {
					price = '<p class="de">' + de + '</p>' +
						'<p class="por">' + por + '</p>';
				} else {
					price = '<p class="por">' + por + '</p>';
				}

				minicartItems.append('<div class="minicart-items__item" product-id="' + minicartCadaItem['productId'] + '" data-id="' + minicartCadaItem['id'] + '">' +
					'   <div class="minicart-items__item-bloco">' +
					'     <span class="minicart-items__item-bloco__imgProduto"><a href="' + link + '"><img src="' + minicartCadaItem['imageUrl'] + '" alt="' + minicartCadaItem['name'] + '" class="img-responsive"/></a></span>' +
					'     <div class="minicart-items__item-bloco__informacoesProduto"> ' +
					'       <button class="minicart-items__item-bloco__informacoesProduto-btnRemove" product-id="' + minicartCadaItem['productId'] + '" data-id="' + minicartCadaItem['id'] + '" data-index="' + x + '"></i></button>' +
					'       <span class="minicart-items__item-bloco__informacoesProduto-contentPriceName"> ' +
					'         <a href="' + link + '"><span class="minicart-items__item-bloco__informacoesProduto-nomeProduto">' + minicartCadaItem['name'] + '</span></a>' +
					// '         <a href="' + link + '"><span class="minicart-items__item-bloco__informacoesProduto-nomeProduto">' + minicartCadaItem['name'].replace(minicartCadaItem['skuName'], '') + '<br />' + minicartCadaItem['skuName'] + '</span></a>' +
					'         <span class="minicart-items__item-bloco__informacoesProduto-price">' + price + '</span>' +
					'       </span> ' +
					'       <div class="minicart-items__item-bloco__informacoesProduto-blocoQtdPreco"> ' +
					'         <div class="minicart-items__item-bloco__informacoesProduto-blocoQtdPreco__qtd">' +
					'           <div class="actions"  data-item="' + x + '">' +
					'             <button type="button" class="btn-qty" data-action="del" data-id="' + minicartCadaItem['id'] + '">-</button>' +
					'             <input type="text" maxlength="3" readonly="readonly" data-id="' + minicartCadaItem['id'] + '" class="qty" value="' + minicartCadaItem['quantity'] + '" />' +
					'             <button type="button" class="btn-qty" data-action="add" data-id="' + minicartCadaItem['id'] + '">+</button>' +
					'           </div>' +
					'         </div>' +
					'         <div class="minicart-items__item-bloco__informacoesProduto-blocoQtdPreco__total">' +
					'           <span class="minicart-items__item-bloco__informacoesProduto-blocoQtdPreco__total-valor">  ' + _that.formatMoney(minicartCadaItem['quantity'] * minicartCadaItem['price'], 2, ',', '.') + '</span>' +
					'         </div>' +
					'        </div>' +
					'     </div> ' +
					'   </div> ' +
					'</div>').removeClass('vazio');

					$('html').removeClass('empty-cart');
			}
		} else {
			minicartItems.html('<p class="minicart-items__vazio"> Ops! Você ainda não colocou nenhum produto em seu carrinho.</p>').addClass('vazio');
			$('html').addClass('empty-cart');
		}

		_that.valorTotalFreteGratis(orderForm);
		_that.tamanhoImgMinicart();
		// this.freteMinicart(orderForm);
	},

	trocandoQtdMinicart: function (orderForm) {
		var _that = this;
		$(document).on('click', '.btn-qty', function () {
			var $this = $(this);
			var $action = $this.attr('data-action');
			var $input = $this.parents('.actions').find('.qty');
			var $itemIndex = $this.parents('.actions').attr('data-item');
			var $itemID = $('.minicart-items__item').attr('product-id');
			var $valor = 0;

			if ($input.length) {

				if ($action === 'add') {
					$valor = parseInt($input.val()) + 1;
				} else if ($action === 'del' && $input.val() > 1) {
					$valor = parseInt($input.val()) - 1;
				}

				if ($valor != 0) {
					vtexjs.checkout.getOrderForm().then(function (orderForm) {
						var updateItem = {
							index: $itemIndex,
							quantity: $valor
						};
						return vtexjs.checkout.updateItems([updateItem], null, false);
					}).done(function (orderForm) {
						_that.atualizandoMinicart(orderForm);
					});
				}
			}
			return false;
		});
	},

	abrindoMinicart: function () {
		$('.page-header__cart, .main-nav__top-link--pedidos').on('click', function (e) {
			e.preventDefault();
			$('#minicartLateral').addClass('aberto');
		})
	},

	fechandoMinicart: function () {
		$(document).on('click', '.minicart-header__btnClose, #overlay', function (e) {
			// $('#minicartLateral').removeClass('aberto')
			e.preventDefault()
			$('body').removeClass('minicart-is-open');
		});
	},

	clickRemovendoItemMinicart: function (orderForm) {
		var _that = this;

		$(document).on('click', '.minicart-items__item-bloco__informacoesProduto-btnRemove', function (e) {
			e.preventDefault();
			console.log('[INDEX MINICART]', $(this).attr('data-index'));
			let dataIndex = parseInt($(this).attr('data-index'));
			vtexjs.checkout.getOrderForm().done(function (orderForm) {
				_that.removendoItemMinicart(dataIndex, orderForm);
			})

			// $(this).parent().remove();
		});
	},

	removendoItemMinicart: function (index, orderForm) {
		var _that = this;
		console.log('[orderForm]', orderForm.items);
		if (orderForm.items.length > 0) {
			var item = orderForm.items[index];
			if (item) {
				item.index = index;
				vtexjs.checkout.removeItems([item]).done(function (orderFormUpdate) {
					_that.atualizandoMinicart(orderFormUpdate);
				});
			}
		}
		// $('#modal-frete').remove();

		$('.minicart-items__item').hide();
		$('.minicart-header__titulo .amount-items-em').text('0');
		$('.minicart-footer__subtotal-valor').text(' 0,00');
		$('.minicart-footer__total-valor').text(' 0,00');
	},

	tamanhoImgMinicart: function () {
		//Função para melhorar a resolução das img    
		$('#minicartLateral .minicart-items__item-bloco__imgProduto img').each(function (i, e) {
			var src = $(e).prop('src');
			src = src.replace('55-55', '100-100');
			$(e).prop('src', src);
		});
	},
	freteMinicart: function (orderForm) {
		var _that = this;
		if (orderForm.items.length > 0) {
			if (orderForm.shippingData.address != null) {

				var arr = orderForm.shippingData.logisticsInfo;
				var html, boxSelectFrete, freteSelect, idSelet = '';
				var obj = {};

				arr.map(function (valor, index) {
					html = '';
					idSelet = valor.selectedSla;

					valor.slas.map(function (i, a) {
						var diasUteis = i.shippingEstimate.replace('bd', ' dias úteis');
						var transporador = i.name;
						var deliveryChannel = i.deliveryChannel;
						var price = i.price;
						var tax = i.tax;
						var id = i.id;

						if (transporador !== 'Retirada em Loja') {
							if (obj[id]) {
								obj[id] = obj[id] + price;
							} else {
								obj[id] = price;
							}

							var valorReais = _that.formatMoney(obj[id], 2, ',', '.');
							var classeLi = id === valor.selectedSla ? 'fretes__container select' : 'fretes__container';

							if (idSelet === id) {
								freteSelect = transporador + ', ' + diasUteis
							}

							if (obj[id] > 0) {
								html += '<li>' +
									'<label class="' + classeLi + '" data-id="' + id + '" data-channel="' + deliveryChannel + '" data-tax="' + tax + '">' +
									transporador + ' -  ' + valorReais + ' - ' + diasUteis +
									'</label>' +
									'</li>'
							} else {
								html += '<li>' +
									'<label class="' + classeLi + '" data-id="' + id + '" data-channel="' + deliveryChannel + '" data-tax="' + tax + '">' +
									transporador + ' - ' + diasUteis +
									'</label>' +
									'</li>'
							}
						}
					})
				})

				boxSelectFrete = ' <div id="modal-frete">' +
					'  <div class="fretes">' +
					'  <span class="fretes__opcaoSelecionado"></span>' +
					'   <ul class="fretes__campo">' + html + '   </ul>' +
					'  </div>' +
					' </div>'

				var setSelect = setInterval(function () {
					if (!$('#modal-frete').length && html) {
						$('.minicart-footer__infoCheckout-blocoCep__cepCalculado').append(boxSelectFrete).addClass('calculando')
					} else {
						$('.fretes__opcaoSelecionado').text(freteSelect)
						clearInterval(setSelect)
					}
				}, 100)

				if (idSelet === 'Retirada em Loja') {
					var slas = arr[0].slas;
					for (var i = 0; i < 2; i++) {
						if (slas[i].id !== 'Retirada em Loja') {
							this.ajaxFrete(slas[i].id, slas[i].deliveryChannel, slas[i].tax)
						}
					}
				}
			}
		} else {
			_that.freteReset();
		}
	},

	ajaxFrete: function (id, channel, tax) {
		var _that = this;
		var orderFormId = vtexjs.checkout.orderForm.orderFormId;
		var address = vtexjs.checkout.orderForm.shippingData.address;
		var logisticsInfoArr = vtexjs.checkout.orderForm.shippingData.logisticsInfo;
		var infoSla = [];

		logisticsInfoArr.map(function (info, index) {
			infoSla.push({
				itemIndex: info.itemIndex,
				selectedSla: id,
				tax: tax,
				selectedDeliveryChannel: channel
			})
		})

		var logisticsInfo = {
			"address": address,
			"logisticsInfo": infoSla
		}

		var url = '/api/checkout/pub/orderForm/' + orderFormId + '/attachments/shippingData';

		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(logisticsInfo),
		})
			.done(function (orderForm) {
				_that.atualizandoMinicart(orderForm);
			})
			.fail(function (error) {
				alert("error", error);
			})
	},

	setFreteMinicart: function () {
		var _that = this;
		$(document).on('click', '.fretes__container', function (event) {
			event.preventDefault();
			$(this).addClass('select');
			$(this).parent('li').siblings('li').find('label').removeClass('select');
			var id = $(this).attr('data-id');
			var channel = $(this).attr('data-channel');
			var tax = $(this).attr('data-tax');

			_that.ajaxFrete(id, channel, tax)
		})
	},

	freteBtnMinicart: function () {
		var _that = this;
		$(document).find('#cepMinicart').mask('00000-000');
		$(document).on('click', '.minicart-footer__infoCheckout-blocoCep__formCep-calculaFrete', function (e) {
			e.preventDefault();
			if ($(".minicart-items .minicart-items__item").length > 0) {
				var address = {
					"postalCode": $('#cepMinicart').val(),
					"country": 'BRA'
				};

				vtexjs.checkout.calculateShipping(address).done(function (data) {
					var slas = data.shippingData.logisticsInfo;
					var msg = true;
					console.warn('[  slas   ]', slas);
					$(slas).each(function (index, valor) {
						if (!valor.selectedSla) {
							msg = false
						}
					})
					if (!msg) {
						$('body').removeClass('minicart-is-open');
						let warnMessage = `<i class="icon-warn"></i>
						<h3>Ops!</h3>
						<p>
						Infelizmente ainda não atendemos sua região.
						</p>
						`;
						$('.ecn-lightbox--wrapper--notify .ecn-lightbox--content--body').html(warnMessage);
						$('.ecn-lightbox--wrapper--notify').show();
						
					}
				})
			} else {
				alert('Coloque um item no carrinho!')
				return false;
			}
		})
	},

	freteBtnRecalcularMinicart: function () {
		var _that = this;
		$(document).on('click', '.minicart-footer__infoCheckout-blocoCep__cepCalculado-excluir', function (event) {
			event.preventDefault();
			_that.freteReset();
		});
	},

	freteReset: function () {
		vtexjs.checkout.calculateShipping()
		$('#modal-frete').remove();
		$('.form-cep span').remove();
		$('.minicart-footer__infoCheckout-blocoCep__frase, .minicart-footer__infoCheckout-blocoCep__formCep').show();
		$('.minicart-footer__infoCheckout-blocoCep__formCep-freteCalculado').html(' 0,00').hide();
		$('.minicart-footer__infoCheckout-blocoCep__cepCalculado').removeClass('calculando');

		$('.minicart-footer__infoCheckout-blocoCep__cepCalculado').hide();


	},

	vendedorAcaoMinicart: function (orderForm) {
		var _that = this;
		$(document).on('click', '.minicart-footer__infoCheckout-blocoVendedor-formVendedor__aplicarVendedor', function (e) {
			e.preventDefault();
			var idConsulta = $(this).parent('.minicart-footer__infoCheckout-blocoVendedor-formVendedor').find('input').val().toUpperCase();
			if (idConsulta.length > 0) {
				_that.vendedorConsultaMinicart(idConsulta);
			}
			return false;
		});
	},

	vendedorConsultaMinicart: function (idConsulta) {

		Cookies.set('cdv', encodeURI(idConsulta));

		var url = '/api/dataentities/VC/';
		var headers = {
			'Accept': 'application/vnd.vtex.ds.v10+json',
			'Content-Type': 'application/json;charset=utf-8',
			'REST-Range': 'resources=0-10'
		};
		$.ajax({
			url: url + 'search?cdv=' + idConsulta + '&_fields=cdv,vendedor,sexo,linx',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			success: function (response) {
				if (response.length > 0) {
					var nomeVendedor = response[0].vendedor;
					var codigoVendedor = response[0].cdv;
					var sexoVendedor = response[0].sexo;
					var strObs = 'VENDEDOR: Codigo:' + codigoVendedor + ' Nome: ' + nomeVendedor;

					if (idConsulta == codigoVendedor) {
						$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor__nomeVendedor').text(nomeVendedor);
						$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor input, .minicart-footer__infoCheckout-blocoVendedor__valor, .minicart-footer__infoCheckout-blocoVendedor-formVendedor__aplicarVendedor').hide();
						$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor button').removeClass('ativo');
						$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor__nomeVendedor, .minicart-footer__infoCheckout-blocoVendedor-formVendedor__excluirVendedor').show();

						vtexjs.checkout.getOrderForm().then(function (orderForm) {
							var newMarketingData = orderForm.marketingData;

							if (newMarketingData == null) {
								newMarketingData = {
									'utmiCampaign': 'vendedorenjoy',
									'utmiPart': strObs,
								}
							} else {
								newMarketingData.utmiCampaign = 'vendedorenjoy';
								newMarketingData.utmiPart = strObs;
							}

							vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
								// localStorage.setItem('sellerInfo', JSON.stringify(response[0]))
							});

						})

					}


				} else {
					alert('Código vendedor inválido');
					$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor__vendedorMinicart').val('');
				}
			},
			error: function (err) {
				console.error('Erro:', err.responseText);
			}
		});
	},

	vendedorRemoveMinicart: function () {
		$(document).on('click', '.minicart-footer__infoCheckout-blocoVendedor-formVendedor__excluirVendedor', function () {
			$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor__nomeVendedor, .minicart-footer__infoCheckout-blocoVendedor-formVendedor__excluirVendedor').hide();
			$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor input, .minicart-footer__infoCheckout-blocoVendedor__valor, .minicart-footer__infoCheckout-blocoVendedor-formVendedor button').show();
			$('.minicart-footer__infoCheckout-blocoVendedor-formVendedor input').val('');
			Cookies.remove('cdv');

			vtexjs.checkout.getOrderForm().then(function (orderForm) {
				var newMarketingData = orderForm.marketingData;
				newMarketingData.utmiCampaign = null;
				newMarketingData.utmiPart = 'Sem vendedor';

				vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
					// localStorage.removeItem('sellerInfo');
				});
			});
		})
	},

	inputValidador: function () {
		$(document).on('keyup', 'input[type="text"]', function (e) {
			if ($(this).hasClass('cep')) {
				$(this).mask('99999-999')
				if ($(this).val().length > 8) {
					$(this).next('button').addClass('ativo');
					if (e.keyCode === 13) {
						$(this).next('button').trigger('click');
					}
				} else {
					$(this).next('button').removeClass('ativo');
				}
			} else {
				if ($(this).val().length > 1) {
					$(this).next('button').addClass('ativo');
					if (e.keyCode === 13) {
						$(this).next('button').trigger('click');
					}
				} else {
					$(this).next('button').removeClass('ativo');
				}
			}
		})
	},

	locationCheck: function(orderForm) {
		if (orderForm && orderForm.shippingData && orderForm.shippingData.address) {
			let UF = orderForm.shippingData.address.state
			let states = ['RJ', 'SP', 'MG']
			let currentRegion = Cookies.get('ECNselectedState')

			if (states.indexOf(UF) == -1) {
				UF = 'OE'
			}
			
			/* Se o estado no shipping data for diferente do selecionado no modal
			 Altera a politica comercial */
			if (UF != currentRegion)	{
				$('#seletor-de-regiao').val(UF).change()
				$('#clear-shipping').val('false').change()
				$('.ecn-lightbox--wrapper--locate-popup form').submit()
			}
		}
	},

	eventosMinicart: function (orderForm) {
		this.clickRemovendoItemMinicart(orderForm);
		this.valorTotalFreteGratis(orderForm);
		this.freteMinicart(orderForm);
		this.vendedorRemoveMinicart();
		this.abrindoMinicart();
		this.fechandoMinicart();
		this.inputValidador();
		this.setFreteMinicart();
	},

	init: function () {
		console.warn('MINICART 1.0');
		var _that = this;
		vtexjs.checkout.getOrderForm().done(function (orderForm) {
			_that.criandoMinicart(orderForm);
			_that.trocandoQtdMinicart(orderForm);
			_that.freteBtnMinicart(orderForm);
			_that.vendedorAcaoMinicart(orderForm);
			_that.eventosMinicart(orderForm);
			_that.locationCheck(orderForm);
			if (Cookies.get('cdv')) {
				_that.vendedorConsultaMinicart(Cookies.get('cdv'))
			}
			$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {				
				_that.atualizandoMinicart(orderForm);
				_that.locationCheck(orderForm);
			});

		})

		$(document).on('click', '.fretes', function (e) {
			$(this).toggleClass('ativo');
		})
	}
})