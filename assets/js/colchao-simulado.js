const qS = (el) => document.querySelector(el)
const qSA = (el) => document.querySelectorAll(el)

const colchaoSimuladoHandler = () => {
  if (!qS(".colchao-simulado__img img"))
    return qS(".colchao-simulado").remove()

	const nav = qS(".colchao-simulado__nav")
	const numberOfContent = qSA(".colchao-simulado__title--text").length

	for (let i = 1; i <= numberOfContent; i++) {
		i === 1
			? nav.insertAdjacentHTML(
					"beforeend",
					`<div class="colchao-simulado__nav-item colchao-simulado__nav-item--${i} colchao-simulado__nav-item--active">${i}</div>`
			  )
			: nav.insertAdjacentHTML(
					"beforeend",
					`<div class="colchao-simulado__nav-item colchao-simulado__nav-item--${i}">${i}</div>`
			  )
	}

	qSA(".colchao-simulado__nav-item").forEach((item) => {
		item.addEventListener("click", () => {
			const navItemActiveClass = "colchao-simulado__nav-item--active"
			const navItemPrefixClass = "colchao-simulado__nav-item--"
			const h2PrefixClass = "colchao-simulado__title--text-"
			const pPrefixClass = "colchao-simulado__description--text-"

			const currentActive = qS(`.${navItemActiveClass}`)
			const currentActiveNumber = currentActive.className.split(navItemPrefixClass)[1]
			const newActiveNumber = item.className.split(navItemPrefixClass)[1]
			const currentActiveH2 = qS(`.${h2PrefixClass}${currentActiveNumber}`)
			const currentActiveP = qS(`.${pPrefixClass}${currentActiveNumber}`)
			const newActiveH2 = qS(`.${h2PrefixClass}${newActiveNumber}`)
			const newActiveP = qS(`.${pPrefixClass}${newActiveNumber}`)

			currentActive.classList.remove(navItemActiveClass)
			item.classList.add(navItemActiveClass)
			currentActiveH2.classList.remove(`${h2PrefixClass}-active`)
			newActiveH2.classList.add(`${h2PrefixClass}-active`)
			currentActiveP.classList.remove(`${pPrefixClass}-active`)
			newActiveP.classList.add(`${pPrefixClass}-active`)
		})
	})

	const imgName = qS(".colchao-simulado__img img")
		.src.split("/")?.[4]
		.replace(/\.png.*/, "")

	setLineGuideProperties(imgName)

	function setLineGuideProperties(imgName) {
		if (!imgName) return
		if (window.innerWidth < 768) return

		const properties = {
			Berlim: {
				1: {
					"--before-height": "95px",
				},
				2: {
					"--before-height": "55px",
				},
			},
			Platinum2: {
				1: {
					"--before-height": "73px",
				},
				2: {
					"--before-height": "33px",
				},
			},
		}

		if (properties[imgName]) {
			Object.keys(properties[imgName]).forEach((key) => {
				const item = qS(`.colchao-simulado__nav-item--${key}`)
				Object.entries(properties[imgName][key]).forEach(
					([varName, value]) => {
						item.style.setProperty(varName, value)
					}
				)
				item.style.setProperty("--line-guide-visibility", "visible")
			})
		}
	}
}

const garantiaHandler = () => {
  if (!qS(".garantia__title")) qS(".garantia").remove()
}

// Init handlers
garantiaHandler()
colchaoSimuladoHandler()
