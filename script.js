async function getDashboardData(url = '/data.json') {
  const response = await fetch(url)
  return await response.json()  //return data
}

class DashboardItem {
  static PERIODS = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  }

  constructor(data, container = '.dashboard__content', view = 'weekly') {
    this.data = data
    this.container = document.querySelector(container)
    this.view = view
    
    this._createMarkup()
  }
  
  _createMarkup() {
    const {title, timeframes} = this.data
    const id = title.toLowerCase().replace(/ /g, '-')
    const {current, previous} = timeframes[this.view.toLowerCase()]
    
    let curPostfix, prevPostfix = 'hr'
    if (current > 1) {
      curPostfix = 'hrs'    
    }

    if (previous > 1) {
      prevPostfix = 'hrs'
    }
    
    this.container.insertAdjacentHTML('beforeend', `
      <div class="dashboard__item dashboard__item_${id}">
          <div class="dashboard__tracking-card tracking-card">
            <div class="tracking-card__header">
              <h3 class="tracking-card__title">${title}</h3>
              <a href="#" class="tracking-card__menu">
                <img src="images/icons/icon-ellipsis.svg" alt="Menu"
                     class="tracking-card__img">
              </a>
            </div>
            
            <div class="tracking-card__body">
              <div class="tracking-card__time">${current + curPostfix}</div>
              <div class="tracking-card__prev-period">Last ${DashboardItem.PERIODS[this.view]} - ${previous +
               prevPostfix}</div>
            </div>
          </div>
        </div>
    `)

    this.time = this.container.querySelector(`.dashboard__item_${id} .tracking-card__time`)
    this.prev = this.container.querySelector(`.dashboard__item_${id} .tracking-card__prev-period`)
  }
  
  changeView(view) {
    this.view = view.toLowerCase()
    const {current, previous} = this.data.timeframes[this.view.toLowerCase()]

    let curPostfix = 'hr' 
    let prevPostfix = 'hr'
    if (current > 1 || current === 0) {
      curPostfix = 'hrs'
    }

    if (previous > 1 || previous === 0) {
      prevPostfix = 'hrs'
    }

    this.time.innerText = `${current + curPostfix}`
    this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous +
    prevPostfix}`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getDashboardData()
    .then(data => {
      const activities = data.map(el => new DashboardItem(el))
      
      const selectors = document.querySelectorAll('.selector__item')
      selectors.forEach(selector => selector.addEventListener('click', function() {
        selectors.forEach(sel => sel.classList.remove('selector__item_active'))
        selector.classList.add('selector__item_active')

        const currentView = selector.innerText.trim().toLowerCase()
        
        activities.forEach(el => el.changeView(currentView))
      }))
    })
})

