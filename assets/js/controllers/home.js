APP.controller.Home = VtexClass.extend({
	init: function () {
		var self = this
		self.setup()
		self.start()
		self.bind()
	},

	setup: function () {
		this.topWebdoor = $(".home__webdoor--slider")
		this.shelfs = $(".home__shelfs")
		this.blogContainer = $(".js-home-blog")
	},

	start: function () {
		console.log("[APP: HOME]")
		this._shelfs()
		this._about()
		this._institutional()
		this._startWebdoor()
		this._startShelf()
		this._changeShelf()
		this.blogFeed()
		this._benefitsBar()
		this.insertComponentInShelf()
	},

	blogFeed() {
		let _that = this
		$.get(
			`//blog.eurocolchoes.com/wp-json/wp/v2/posts?per_page=3`,
			function (posts) {
				if (posts && posts.length)
					try {
						posts.map((p) => {
							let tpl = ""
							$.get(p["_links"]["wp:featuredmedia"][0].href).done(
								function (img) {
									let imgSizes = img.media_details && img.media_details.sizes

									tpl = `
                    <li class="blog__item">
                      <div class="blog__item-img">
                        <a href="${p.link}" target="_blank">
                          <img src="${imgSizes ? imgSizes.full.source_url : ""}">
                        </a>
                      </div>
                      <div class="blog__item-info">
                        <h4 class="blog__item-title">${p.title.rendered}</h4>
                        <div class="blog__item-desc only-desk">
                          ${p.excerpt.rendered.length > 200 ? p.excerpt.rendered.substring(0, 200) + "..." : p.excerpt.rendered}
                        </div>
                        <a class="btn btn--pink btn--read-more only-desk" href="${p.link}" target="_blank"> Confira</a>
                      </div>
                    </li>
                  `

									_that.blogContainer.append(tpl)
								}
							)
						})
					} catch (e) {
						console.log(e)
					}
			}
		)
	},

	_shelfs: function () {
		this.shelfs.find(".home__shelfs--container").html("")
	},

	_institutional: function () {
		var destroyCrappyPlugin = function ($elem, eventNamespace) {
			var isInstantiated = !!$.data($elem.get(0))

			if (isInstantiated) {
				$.removeData($elem.get(0))
				$elem.off(eventNamespace)
				$elem.unbind("." + eventNamespace)
			}
		}

		let thumbVideo = $(".home__institutional--call-to-action a")
		let elemI = thumbVideo.eq(0)

		thumbVideo.each(function (i, e) {
			let elVideo = $(e)
			let idVideo = elVideo.attr("href").replace("#", "")

			elVideo.modalVideo({ videoId: idVideo })
		})

		$(".home__institutional--slider--wrapper").on("init", function () {
			elemI.addClass("active")
		})

		$(".home__institutional--slider--wrapper").on(
			"beforeChange",
			function (event, slick, currentSlide, nextSlide) {
				thumbVideo.removeClass("active")
				let elemI = thumbVideo.eq(nextSlide)
				elemI.addClass("active")
			}
		)

		$(".home__institutional--slider--wrapper").slick({
			dots: true,
			arrows: false,
			autoplay: false,
			infinite: false,
			fade: true,
			cssEase: "linear",
			// responsive: [{
			//   breakpoint: 996,
			//   settings: {
			//     fade: false,
			//     adaptiveHeight: true
			//   }
			// }]
		})
	},

	_about: function () {},

	_startWebdoor: function () {
		this.topWebdoor.slick({
			dots: true,
			arrows: true,
			autoplay: true,
			autoplaySpeed: 5000,
			speed: 1000,
			infinite: true,
			cssEase: "linear",
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToScroll: 1,
						fade: false,
					},
				},
			],
		})
	},

	_buildShelf: function (collectionID, shelfContainer) {
		let _that = this
		var urlLoad = `/buscapagina?sl=13083d89-42c1-4d88-b364-f63143073387&PS=6&cc=7&sm=0&PageNumber=1&fq=H:${collectionID}`
		shelfContainer.load(urlLoad, function () {
			arrumaPrateleira()
		})

		function arrumaPrateleira() {
			$(".helperComplement").remove()
			_that._slickShelf(shelfContainer)
		}
	},

	_slickShelf: function (shelf) {
		if ($(window).width() < 992) {
			$(shelf).find(".shelf__default>ul").slick({
				dots: true,
				arrows: true,
				autoplay: true,
				slidesToShow: 1,
				slidesToScroll: 1,
			})
		}
	},

	_startShelf: function () {
		let _that = this
		this.shelfs.each(function (index) {
			let shelfContainer = $(this).find(".home__shelfs--container")
			let shelfNav = $(this).find(".home__shelfs--nav")
			let firstItem = shelfNav.find("ul li:first-of-type a")
			firstItem.addClass("active")
			let collectionId = firstItem.data("collection")
			_that._buildShelf(collectionId, shelfContainer)
		})
	},

	_changeShelf: function () {
		let _that = this
		$(".home__shelfs--nav").on("click", "a[data-collection]", function (e) {
			e.preventDefault()
			console.log("click item")
			$(this)
				.parents(".home__shelfs")
				.find(".home__shelfs--nav a[data-collection]")
				.removeClass("active")
			$(this).addClass("active")
			let container = $(this)
				.parents(".home__shelfs")
				.find(".home__shelfs--container")
			let collection = $(this).data("collection")

			_that._buildShelf(collection, container)
		})
	},

	_formatMoney: function (int) {
		if (int < 0) {
			var tmp = int * -1 + ""
			tmp = tmp.replace(/([0-9]{2})$/g, ",$1")
			if (tmp.length > 6)
				tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2")

			return "-" + tmp
		} else {
			var tmp = int + ""
			tmp = tmp.replace(/([0-9]{2})$/g, ",$1")
			if (tmp.length > 6)
				tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2")

			return tmp
		}
	},

	_benefitsBar: function () {
		var $benefitsSlick = false

		function benefitsSlick() {
			if ($(window).width() < 992) {
				if (!$benefitsSlick) {
					$(".home__benefits-bar--wrapper ul").slick({
						dots: false,
						arrows: false,
						autoplay: true,
						slidesToShow: 1,
						slidesToScroll: 1,
					})
					$benefitsSlick = true
				}
			} else {
				if ($benefitsSlick === true) {
					$(".home__benefits-bar--wrapper ul").slick("unslick")
					$benefitsSlick = false
				}
			}
		}

		benefitsSlick()
		$(window).on("resize", function () {
			benefitsSlick()
		})
	},

	bind: function () {},

	insertComponentInShelf: function () {
		var classShelf = document.querySelectorAll(".shelf__default ul li")
		var idsProduct = document
			.querySelector(".produtos")
			.dataset.ids.split(",")

		classShelf.forEach(function (el) {
			var currentElement = el.querySelector(".idProd")
			if (!currentElement) return
			var currentElementId = currentElement.dataset.id

			var verifyLiArray = idsProduct.find(function (id) {
				return id === currentElementId
			})
			if (verifyLiArray) {
				var structureHtml =
					'<div class="timer-container">' +
					' <div class="timer">' +
					"<span>" +
					"A OFERTA EXPIRA EM" +
					"</span>" +
					'<div class="an1Counter">' +
					'<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
					'<path d="M8.99999 15.75C12.3137 15.75 15 13.0637 15 9.75C15 6.43629 12.3137 3.75 8.99999 3.75C5.68628 3.75 2.99998 6.43629 2.99998 9.75C2.99998 13.0637 5.68628 15.75 8.99999 15.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					'<path d="M9 6.75V9.75L10.5 11.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					'<path d="M3.75001 2.25L1.50002 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					'<path d="M16.5 4.5L14.25 2.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					'<path d="M4.49998 14.25L2.99998 15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					'<path d="M13.5 14.25L15 15.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
					"</svg>" +
					'<div class="enhacedCounter__time -hours">' +
					'<div class="enhacedCounter__number -hours" ></div>' +
					"</div>" +
					'<div class="enhacedCounter__time -minutes">' +
					'<div class="enhacedCounter__number -minutes" ></div>' +
					"</div>" +
					'<div class="enhacedCounter__time -seconds">' +
					'<div class="enhacedCounter__number -seconds" ></div>' +
					"</div>" +
					"</div>" +
					"</div>" +
					"</div>"

				var createEl = document.createElement("div")
				createEl.setAttribute("class", "cronometro")
				$(createEl).html(structureHtml)

				el.append(createEl)
			}
		})
	},
})
