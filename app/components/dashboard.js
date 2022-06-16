import coinGecko from '../helpers/coinGeckoApi.js'
import { ajax } from '../helpers/ajax.js'
import {
  sortTable,
  filterTable,
  populateArray,
  resetTable
} from '../helpers/table.js'
import { coinObjects } from '../helpers/models.js'

export function dashboard() {
  // DOM elements
  const dashboardTableBody = document.querySelector('.table-body'),
    sortSelecor = document.querySelector('#sort'),
    dashboardFilter = document.querySelector('#filter'),
    dashboardCoinsTable = document.querySelector('.coins-table'),
    calculator = document.querySelector('.calculator'),
    calcCoinLogo = document.querySelector('.coinLogo'),
    calcSelectedCoin = document.querySelector('.selectedCoin'),
    calcUserInput = document.querySelector('.coinInput'),
    calcResult = document.querySelector('.result'),
    calcReturnArrow = document.querySelector('.arrowSvg'),
    tableHeadersArray = [
      'current_price',
      'ath',
      'ath_change_percentage',
      'circulating_supply',
      'market_cap_rank'
    ]

  callTable()
  setInterval(callTable, 90000)

  sortSelecor.addEventListener('change', () => {
    resetTable(renderTable)
  })

  dashboardFilter.addEventListener('keyup', () => {
    resetTable(renderTable)
  })

  // Functions
  function callTable() {
    ajax({
      url: coinGecko.dashboard_call,
      cbSuccess: res => {
        console.log(res)
        populateArray(res, coinObjects)
        resetTable(renderTable)
        // console.log('click')
      }
    })
  }

  function renderTable() {
    let coinsCopy = coinObjects
    const sortSelecorValue = sortSelecor.value,
      dashboardFilterValue = dashboardFilter.value

    sortTable(sortSelecorValue, coinsCopy)
    coinsCopy = filterTable(dashboardFilterValue, coinsCopy, coinObjects)

    coinsCopy.forEach(coin => {
      const tableRow = document.createElement('tr'),
        coinTd = document.createElement('td'),
        logoImg = document.createElement('img'),
        name = document.createTextNode(coin.name)
      tableRow.classList.add(`${coin.id}`)

      logoImg.src = `${coin.image}`
      coinTd.appendChild(logoImg)

      coinTd.appendChild(name)
      tableRow.appendChild(coinTd)
      dashboardTableBody.appendChild(tableRow)

      tableHeadersArray.forEach(header => {
        let tableData = document.createElement('td'),
          input = document.createTextNode(`${coin[header]}`)
        tableData.appendChild(input)
        tableData.classList.add(`${header}`)
        tableRow.appendChild(tableData)
      })

      dashboardTableBody.appendChild(tableRow)

      // displayCalculator(tableRow, coin)

      tableRow.addEventListener('click', () => {
        calcCoinLogo.src = `${coin.image}`
        calcSelectedCoin.innerHTML = `${coin.name}`
        dashboardCoinsTable.classList.add('displayNone')
        calculator.classList.remove('displayNone')
        calcUserInput.value = 1
        const coinPrice = coin.current_price
        calcResult.innerHTML = `$ ${(coinPrice * calcUserInput.value).toFixed(
          2
        )}`
        // respond to any input change
        ;['click', 'keyup', 'change'].forEach(evento =>
          calcUserInput.addEventListener(evento, () => {
            calcResult.innerHTML = `$ ${(
              coinPrice * calcUserInput.value
            ).toFixed(2)}`
          })
        )
        //get coin info
        ajax({
          url: `https://api.coingecko.com/api/v3/coins/${coin.id}`,
          cbSuccess: res => {
            console.log(res.description.en)
            document.querySelector('.coin-info-body').innerHTML =
              res.description.en
          }
        })

        // return to table
        calcReturnArrow.addEventListener('click', () => {
          calculator.classList.add('displayNone')
          dashboardCoinsTable.classList.remove('displayNone')
        })
      })
    })
  }
}
