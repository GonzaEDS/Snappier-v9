import { Coin } from './models.js'

// Functions
export function populateArray(coinsApiData, coinsArray) {
  coinsApiData.forEach(coin => {
    coinsArray[coin['market_cap_rank'] - 1] = new Coin(
      coin['id'],
      coin['name'],
      coin['symbol'],
      coin['current_price'],
      coin['image'],
      coin['total_supply'],
      coin['ath'],
      coin['ath_change_percentage'],
      coin['circulating_supply'],
      coin['market_cap_rank'],
      coin['price_change_percentage_24h']
    )
  })
}

export function resetTable(cbRenderTable) {
  document.querySelectorAll('tbody tr').forEach(e => {
    e.remove()
  })
  cbRenderTable()
}

export function filterTable(filter, newArray, array) {
  if (filter) {
    newArray = array.filter(e =>
      e.name.toLowerCase().includes(filter.toLowerCase())
    )
  }
  if (newArray.length == 0) {
    const tableRow = document.createElement('tr'),
      msjTd = document.createElement('td'),
      message = document.createTextNode('No matches')
    tableRow.classList.add('no-matches-row')
    msjTd.colSpan = 6
    msjTd.appendChild(message)
    tableRow.appendChild(msjTd)
    document.querySelector('.table-body').appendChild(tableRow)
  }
  return newArray
}

export function sortTable(selector, array) {
  switch (selector) {
    case 'price':
      array.sort((a, b) => b.current_price - a.current_price)
      break
    case 'ATH':
      array.sort((a, b) => b.ath - a.ath)
      break
    case 'ATHchangepercentage':
      array.sort((a, b) => a.ath_change_percentage - b.ath_change_percentage)
      break
    case 'circulatingSupply':
      array.sort((a, b) => b.circulating_supply - a.circulating_supply)
      break
    case 'marketCap':
      array.sort((a, b) => a.market_cap_rank - b.market_cap_rank)
      break
    case 'name':
      array.sort((a, b) => (a.name > b.name ? 1 : -1))
      break
  }
}
