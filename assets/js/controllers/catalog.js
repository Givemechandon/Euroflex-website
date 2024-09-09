APP.controller.Catalog = VtexClass.extend({
    init: function () {
        this.setup()
        this.start()
        this.bind()
        this.load()

    },

    setup: function () {
        this.$mainResult = $('.catalog__search--info')
        this.$mobIsVisible = $('.menu-bar')
        this.$header = $('.header')
        this.$mainShelf = $('.shelf__default')
        this.$searchFilter = $('.search-filter')
        this.$resultItems = $('.resultItemsWrapper div[id^="ResultItems"]')
        this.$order = $('.search-order')
        this.$gridControl = true
        this.mainShelfPosition = parseInt(this.$mainShelf.offset().top) - this.$header.outerHeight();


        // APP.i.Select = new APP.component.Select({
        //   selector: this.$order
        // })

    },

    start: function () {
        this.searchResult()
        this.createClearFilterButton()
        this.removeFilterCounter()
        this.startVtexSearch()
        this.accordionFilters()
        this.multipleNavigatorHelper()
        this.orderBy()
        this.checkedFilters()
        this._slick()
        this.produtoEsgotado()
        // this.insertComponentInShelf()
        /*  if (window.location.href.indexOf('vtex') > -1) {} */


        APP.i.Cart = new APP.component.catalogFilter()

        if (this.$gridControl === true) {
            APP.i.Cart = new APP.component.gridControl()
        }

        $('#search-order').select2({ dropdownCssClass: 'dropdown-order' })

    },

    load: function () {
        var _this = this;
        $(window).load(function () {
            _this.insertComponentInShelf();
        });
    },

    produtoEsgotado: function () {
        setTimeout(function () {
            $('.shelf__default li').find('.onlineSale').each(function () {
                var verifica = $(this).find('li').hasClass('nao')

                if (verifica) {
                    $(this).next('.shelf__default--wrapper').find('.shelf__default--no-stock-message').addClass('saibaMais')
                }
            })
        }, 2000);
    },
    _slick: function () {
        $('.catalog__shelf--wrapper .shelf__default>ul').slick({
            dots: false,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: false,
            infinite: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ]
        })
    },
    _hideResult: function () {
        this.$resultItems
            .find('.main-shelf > ul')
            .stop(true, true)
            .slideUp('slow')
    },
    _showResult: function () {
        this.$resultItems
            .find('.main-shelf > ul')
            .stop(true, true)
            .slideDown('slow')
    },

    _scrollToTopResult: function () {
        $('html, body')
            .stop()
            .animate({
                scrollTop: 0
            }, 500);
    },

    orderBy: function () {
        $('.catalog__mobile--order ul li a').each(function () {
            var selectedEl = $('.resultado-busca-filtro').find('.orderBy').find(':selected').val();
            if (selectedEl == $(this).data('value')) {
                $(this).addClass('active');
            }
        });
        $('.search-order option').each(function () {
            var selectedEl = $('.resultado-busca-filtro').find('.orderBy').find(':selected').val();
            if (selectedEl == $(this).val()) {
                console.log('ok', $(this).val())
                $(this).attr('selected', true)
            }
        });


        $('.search-order').on('change', function () {
            $('.resultado-busca-filtro').find('.orderBy').find('select').val(this.value).change();
        })

        $('.catalog__mobile--order ul li a').on('click', function () {
            let selected = $(this).data('value');
            $('.resultado-busca-filtro').find('.orderBy').find('select').val(selected).change();
        })

    },

    searchResult: function () {
        const $body = $('body')

        const SearchResult = new APP.component.SearchResult()

        const total = SearchResult.getTotalSearchResult()
        const terms = SearchResult.getTermsSearchResult()


        if (!document.querySelector('.catalog__search--info--wrapper')) {

            if ($body.hasClass('search')) {

                const $resultBar = `<div class="container">
                                      <div class="row">
                                        <div class="col-xs-12">
                                          <div class="catalog__search--info--wrapper">
                                          <strong>Você buscou por: <span>${terms}</span></strong>
                                          <span>Aqui estão os produtos que encontramos</span>
                                          <span style="display: none;">Encontramos ${total} produto(s)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>`

                this.$mainResult.append($resultBar)
            }
        }

        const $listResult = `${total} produto(s)`
        $('.catalog__search--result--busca').html($listResult)
    },

    createClearFilterButton: function () {
        const $buttons = `<div class="search-filter__buttons">
                        <button class="search-filter__button search-filter__button--apply">Aplicar filtros</button>
                        <button class="search-filter__button search-filter__button--clear">Limpar filtros</button>
                      </div>`

        this.$searchFilter.append($buttons)
    },

    removeFilterCounter: function () {
        const self = this;

        $('.menu-departamento label, .menu-departamento a').each(function () {
            const _this = $(this);

            const text = _this.text();
            const removeCounter = text.replace(/(\s)(\()([0-9]*)(\))/gi, '');

            if (typeof _this.contents()[1] !== 'undefined') {
                _this.contents()[1].nodeValue = removeCounter;
            } else {
                _this.text(removeCounter);
            }
        });
    },

    multipleNavigatorHelper: function () {
        let _that = this;
        const replaceSpecialChars = (str) => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/([^\w]+|\s+)/g, '-') // replace espaço e outros caracteres por hífen
                .replace(/\-\-+/g, '-') // replace multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''); // remove hífens extras do final ou do inicio da string
        }
        $('.search-multiple-navigator input:checkbox').each(function () {
            let cssClass = replaceSpecialChars($(this).val());
            $(this).parent('label').addClass(cssClass);
        })

        /*  if (window.location.href.indexOf('vtex') > -1) { */
        $('.catalog--clear-filters').on('click', function (e) {
            e.preventDefault();

            /* $('.search-multiple-navigator').parent().find("label.filter--active").each(function() {
                $(this).find('input').trigger("click"),
                    $(this).removeClass("filter--active");
                $(".catalog__selected-filters .filter").remove();
                $('.catalog__search-result--selected-filters').hide()
                $('.catalog__selected-filters').hide()
            }) */
            // Cookies.remove('VtexSearchQuery')

            // window.location.reload()
        });

        /*  }, */
        /*   }) */



        /*     }); */
        /*  } else {
             $('.catalog--clear-filters').on('click', function(e) {
                 e.preventDefault();

                 $('.search-multiple-navigator').parent().find("label.filter--active").each(function() {
                     $(this).find('input').trigger("click"),
                         $(this).removeClass("filter--active");
                     $(".catalog__selected-filters .filter").remove();
                     $('.catalog__search-result--selected-filters').hide()
                     $('.catalog__selected-filters').hide()
                 })
             }); */
        /* } */
    },

    startVtexSearch: function () {
        this.$resultItems
            .vtexSearch({
                $selectOrder: this.$order,
                pagination: false,
                textLoadMore: 'Ver todos'
            })
            .on('vtexsearch.beforeFilter vtexsearch.beforeChangeOrder vtexsearch.beforeChangePage', () => {
                this._hideResult()
                this._scrollToTopResult()
            })
            .on('vtexsearch.afterFilter vtexsearch.afterChangeOrder vtexsearch.afterChangePage', () => {
                this._showResult()
            })
            .on('vtexsearch.afterSearch', () => {
                this.searchResult()
            })
    },

    checkedFilters: function () {
        $(".refino input:checkbox").change(function () {
            var text = $(this).parent("label").text();
            var className = $(this).parent("label").attr("class");
            className = className.replace(" filter--active", "");
            if ($(this).is(":checked")) {
                var template = `<div class="filter ${className}" data-class="${className}">${text}</div>`;
                $(template).appendTo(".catalog__selected-filters");
                click(className);
                $('.catalog__search-result--selected-filters').show()
                $('.catalog__selected-filters').show()
            } else {
                $('.catalog__selected-filters .filter[data-class="' + className + '"]').remove();
                if (!$('.catalog__selected-filters').find('.filter')) {
                    $('.catalog__search-result--selected-filters').hide()
                    $('.catalog__selected-filters').hide()
                }
            }
        });

        function click(classElement) {
            $(".filter").on("click", function () {
                var classFilter = $(this).attr("class");
                classFilter = classFilter.replace("filter ", "");
                $(".search-multiple-navigator label.filter--active").each(function () {
                    console.log('classFilter', classFilter);
                    if ($(this).hasClass(classFilter)) {
                        console.log('condicional');
                        console.log('this', $(this));
                        $(this).trigger("click");
                    }
                });
            });
        }
    },

    _isMob: function () {
        if (this.$mobIsVisible.is(':visible')) {
            return true
        }

        return false
    },

    bind: function () {
        this.bindOpenFilter()
        this.bindOpenOrder()
        this.bindCloseFilter()
        this.bindCloseOrder()
    },

    bindOpenFilter: function () {
        $('.catalog__mobile-navigation--toggle-filter').on('click', event => {
            event.preventDefault()

            $('body').addClass('filter-is-open')
        })
    },
    bindOpenOrder: function () {
        $('.catalog__mobile-navigation--toggle-order').on('click', event => {
            event.preventDefault()

            $('body').addClass('order-is-open')
        })
    },

    bindCloseFilter: function () {
        $('.catalog__navigator--head, #overlay, .catalog__navigator--footer .catalog--filter, .catalog__search-result--head a').on('click', event => {
            event.preventDefault()

            $('body').removeClass('filter-is-open')

        })
    },
    bindCloseOrder: function () {
        $('.catalog__mobile--order--head a, #overlay').on('click', event => {
            event.preventDefault()

            $('body').removeClass('order-is-open')
        })
    },


    accordionFilters: function () {
        $('.search-multiple-navigator').on('click', 'h5', function (e) {
            e.preventDefault()
            $(this).toggleClass('active');
            $(this).next('div').slideToggle();

        })
    },

    insertComponentInShelf: function () {
        if (document.querySelector('.an1Counter').classList.contains('offTime')) {
            console.log('tempo ja acabou, voltando aqui');
            return;
        };
        console.log('tempo nao acabou, passando aqui');
        var classShelf = document.querySelectorAll('.shelf__default>ul>li, .shelf__default .slick-slide div>li');
        var idsProduct = document.querySelector('.produtos').dataset.ids.split(',');

        classShelf.forEach(function (el) {

            var currentElement = el.querySelector('.idProd');
            if (!currentElement) return
            var currentElementId = currentElement.dataset.id;

            var verifyLiArray = idsProduct.find(function (id) {
                return id === currentElementId;
            });

            if (verifyLiArray) {
                var structureHtml = '<div class="timer-container">' +
                    ' <div class="timer">' +
                    '<span>' +

                    'A OFERTA EXPIRA EM' +
                    '</span>' +
                    '<div class="an1Counter">' +
                    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M8.99999 15.75C12.3137 15.75 15 13.0637 15 9.75C15 6.43629 12.3137 3.75 8.99999 3.75C5.68628 3.75 2.99998 6.43629 2.99998 9.75C2.99998 13.0637 5.68628 15.75 8.99999 15.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<path d="M9 6.75V9.75L10.5 11.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<path d="M3.75001 2.25L1.50002 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<path d="M16.5 4.5L14.25 2.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<path d="M4.49998 14.25L2.99998 15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<path d="M13.5 14.25L15 15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>' +

                    '<div class="enhacedCounter__time -hours">' +
                    '<div class="enhacedCounter__number -hours" ></div>' +
                    '</div>' +

                    '<div class="enhacedCounter__time -minutes">' +
                    '<div class="enhacedCounter__number -minutes" ></div>' +
                    '</div>' +

                    '<div class="enhacedCounter__time -seconds">' +
                    '<div class="enhacedCounter__number -seconds" ></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'

                var createEl = document.createElement('div');
                createEl.setAttribute('class', 'cronometro')
                $(createEl).html(structureHtml);

                el.append(createEl);
            }
        })
    }
})