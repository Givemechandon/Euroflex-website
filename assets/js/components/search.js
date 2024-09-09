APP.component.Search = VtexClass.extend({
  init: function (options) {
    this.setup(options)
    this.start()
    this.bind()
  },

  setup: function (options) {
    this.options = $.extend({
      delay: 300,
      maxRows: 9,
      mobileAutoComplete: false,
      thumbSize: 246,

      $scope: $('.header__search'),
      $input: $('.search__input'),
      $button: $('.search__submit'),
      $linkViewAll: '.search__category--view-all',
      $mobIsVisible: $('.menu-bar'),

      classOpen: 'body-header__search--open',
      classTarget: 'search__target',
      classTargetList: 'search__target__list',
      classCategoryList: 'search__category__list',
      classCategoryListItem: 'search__category__item',
      classTargetListItem: 'search__target__item',
      classTargetListItemImage: 'search__target__item--image',
      classTargetListItemCategory: 'search__category__item--category',
      classTargetListLink: 'search__target__link'
    }, options)
  },

  start: function () {},

  bind: function () {
    this.bindClickOutside()
    this.bindSearchSubmit()
    this.bindSearch()
  },

  bindClickOutside: function () {
    $(document).on('click', event => {
      const $closeBox = this.options.$scope

      if (!$closeBox.is(event.target) && $closeBox.has(event.target).length === 0) {
        $('body').removeClass(this.options.classOpen)

        this.options.$scope.find(`.${this.options.classTarget}`)
          .html('')
          .hide()
          .css({
            height: ''
          })
      }
    })
  },

  bindSearchSubmit: function () {
    this.options.$button.on('click', event => {
      event.preventDefault()

      const val = this.options.$input.val()

      if (val !== '') {
        this.submitSearch(val)

      } else {
        this.options.$input.focus()
      }
    })

    $(document).on('click', this.options.$linkViewAll, event => {
      console.log('click link', $(this))
      event.preventDefault()

      const val = this.options.$input.val()

      if (val !== '') {
        this.submitSearch(val)

      } else {
        this.options.$input.focus()
      }
    })
  },


  bindSearch: function () {
    let delay

    this.options.$input.on('keyup', event => {
      event.preventDefault()

      const _this = $(event.currentTarget)
      const val = _this.val()
      const code = event.keyCode || event.which

      if (code === 13 && val !== '') {
        this.submitSearch(val)

        return true
      }

      if (this._isMob() && this.options.mobileAutoComplete === false) {
        return true
      }

      clearTimeout(delay)

      delay = setTimeout(() => {
        if (val === '') {
          this.options.$scope
            .find(`.${this.options.classTarget}`)
            .html('')
            .hide()
            .css('height', '')

          return
        }

        this.getSearchResult(val)
      }, this.options.delay)
    })
  },

  submitSearch: function (terms) {
    const urlTerms = encodeURI(terms.trim())

    window.location = `/${urlTerms}`
  },

  getSearchResult: function (terms) {
    $.ajax({
      // url: 'https://tezm99.myvtex.com/buscaautocomplete/',
      url: '/buscaautocomplete',
      type: 'get',
      data: {
        maxRows: this.options.maxRows,
        productNameContains: terms
      }
    }).then((response) => {
      console.log('searchResponse', response)
      const items = response.itemsReturned
      if(items.length === 0){
        return;
      }
      const $listResult = $(`<div class="container"><ul class="${this.options.classCategoryList}" ></ul><ul class="${this.options.classTargetList}" ></ul></div>`)

      items.map(item => {
        const { name, href, thumb } = item
        const $thumb = this._changeImageSize(thumb, this.options.thumbSize, 25)

        let nameSplit = name.split(' ')
        let last = nameSplit.pop();
        let nameFinal = nameSplit.join(" ") + (nameSplit.length > 0 ? ' <strong class="last">'+last+'</strong>' : last);

        const $contentTitle = $('<span />').append(nameFinal)

        const $link = $(`<a />`, {
          class: this.options.classTargetListLink,
          href
        })

        $link.append($thumb)
        $link.append($contentTitle)

        const $item = $(`<li class="${this.options.classTargetListItem}" />`)
        if ($thumb !== '') {
          $item.addClass(this.options.classTargetListItemImage)
          $listResult.find(`.${this.options.classTargetList}`).append($item)
          $item.append($link)
        } else {
          $item.addClass(this.options.classTargetListItemCategory)
          $listResult.find(`.${this.options.classCategoryList}`).append($item)
          $item.append($link)
        }
       
        
      })

      this.options.$scope.find(`.${this.options.classTarget}`)
        .html($listResult).find(`.${this.options.classCategoryList}`).append('<li><a href="javascript:void(0)" class="search__category--view-all">Ver todos</a></li>')
        
      this.options.$scope.find(`.${this.options.classTarget}`).show()
    })
  },

  _changeImageSize: function (image, newSize, actualSize) {
    return image
      .replace(`-${actualSize}-${actualSize}`, `-${newSize}-${newSize}`)
      .replace(`width="${actualSize}"`, `width="${newSize}"`)
      .replace(`height="${actualSize}"`, `height="${newSize}"`)
  },

  _isMob: function () {
    if (this.options.$mobIsVisible.is(':visible')) {
      return true
    }

    return false
  }
})
