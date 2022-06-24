import { coinObjects, getUsersList } from '../helpers/models.js'
import { ajax } from '../helpers/ajax.js'
import coinGecko from '../helpers/coinGeckoApi.js'
import { populateArray } from '../helpers/table.js'
import { getCurrentUser } from '../helpers/session.js'
import { formatDate } from '../helpers/history.js'
import { getId } from './user.js'

const usersList = getUsersList()
const user = getCurrentUser()
export function chart() {
  requireAuth(getCurrentUser())
  ajax({
    url: coinGecko.dashboard_call,
    cbSuccess: res => {
      // let newData = res.map(coin =>
      //   (({ name, symbol, id }) => ({ name, symbol, id }))(coin)
      // )
      populateArray(res, coinObjects)
      populateCoinsList(coinObjects)
      placeOrder()
      orderEvents(getCurrentUser())
      populateWallet(getCurrentUser())
      populateHistory(getCurrentUser())
      parseChartData(coinObjects[0])
    }
  })
}
function orderEvents(user) {
  document.querySelectorAll('.buySellButton').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault()

      const type = e.currentTarget.dataset.operation,
        quantityInput = document.querySelector(
          `.orderForm-input[data-operation=${type}]`
        ),
        quantityInputValue = Number(quantityInput.value),
        totalInput = document.querySelector(
          `input[name=total][data-operation=${type}]`
        ),
        totalInputValue = Number(totalInput.value)

      let message = user.userOperation(
        type,
        getSelectedCoin(),
        quantityInputValue,
        totalInputValue
      )

      avblUsd()
      avblCoin()

      //   update usersList
      usersList.splice(
        Number(localStorage.getItem('loged-user-id') - 1),
        1,
        user
      )
      //   save
      localStorage.setItem('users', JSON.stringify(usersList))

      //toast
      let toastBg
      message == 'Successful operation'
        ? (toastBg =
            'linear-gradient(to right, rgb(12 106 72), rgb(12, 150, 100))')
        : (toastBg =
            'linear-gradient(to right, rgb(114 15 28), rgb(179, 55, 71))')
      Toastify({
        text: message,
        position: 'center',
        duration: 2000,
        gravity: 'top',
        style: {
          background: toastBg
        }
      }).showToast()

      populateWallet(getCurrentUser())

      populateHistory(getCurrentUser())
    })
  })
}

function populateWallet(user) {
  const UserWallet = user.wallet,
    userCashTd = document.querySelector('.user-cash'),
    coinsTbody = document.querySelector('.wallet-coins'),
    walletCoinsArray = Object.keys(UserWallet.coins)

  userCashTd.innerHTML = Number(UserWallet.cash).toFixed(2)
  while (coinsTbody.firstChild) {
    coinsTbody.removeChild(coinsTbody.firstChild)
  }
  walletCoinsArray.forEach(coin => {
    const newTr = document.createElement('tr'),
      newCoinTd = document.createElement('td'),
      newCoinImg = document.createElement('img'),
      newCoinDiv = document.createElement('div'),
      newAmountTd = document.createElement('td')
    newCoinImg.src = coinObjects.find(
      coinObject => coinObject.name === coin
    ).image

    newCoinDiv.innerHTML = coin

    newAmountTd.innerHTML = UserWallet.coins[coin]
    newCoinTd.appendChild(newCoinImg)
    newCoinTd.appendChild(newCoinDiv)
    newTr.appendChild(newCoinTd)
    newTr.appendChild(newAmountTd)
    coinsTbody.appendChild(newTr)
  })
  getBalance(user)
}

function populateCoinsList(coinsArray) {
  const tbody = document.querySelector('.coins-list tbody')
  coinsArray.forEach(coin => {
    const newRow = document.createElement('tr'),
      coinTd = document.createElement('td'),
      priceTd = document.createElement('td'),
      changeTd = document.createElement('td'),
      coinimg = document.createElement('img'),
      nameDiv = document.createElement('div')
    newRow.dataset.id = `${coin.id}`
    coinTd.classList.add('cl-coin-td')
    priceTd.classList.add('cl-price-td')
    changeTd.classList.add('cl-change-td')
    nameDiv.innerHTML = coin.name
    priceTd.innerHTML = coin.current_price
    changeTd.innerHTML = coin.price_change_percentage_24h
    if (coin.price_change_percentage_24h < 0) {
      changeTd.style.color = '#ff2525e8'
    } else {
      changeTd.style.color = '#0c9664'
    }
    coinimg.src = coin.image
    coinTd.append(coinimg, nameDiv)
    newRow.append(coinTd, priceTd, changeTd)
    tbody.appendChild(newRow)
    newRow.addEventListener('click', () => {
      document
        .querySelectorAll('.quantity .orderForm-input-labels, .btn-coin-label')
        .forEach(element => {
          element.innerHTML = coin.symbol.toUpperCase()
        })
      document.querySelector('.order-forms').dataset.selectedCoin = coin.name
      clearInputs()
      avblCoin()
      parseChartData(coin)
    })
  })
}

function populateHistory(user) {
  const history = user.history,
    historyTbody = document.querySelector('.ts-history tbody')
  while (historyTbody.firstChild) {
    historyTbody.removeChild(historyTbody.firstChild)
  }
  history.forEach(operation => {
    const newRow = document.createElement('tr'),
      cells = [
        'time',
        'type',
        'coinName',
        'amount',
        'price_unit',
        'price_total'
      ]
    cells.forEach((cell, index) => {
      const newTd = document.createElement('td')
      let content = operation[cell]
      if (index == 0) {
        content = formatDate(new Date(operation[cell]))
      }
      newTd.innerHTML = content
      newTd.classList.add(`${cell}Cell`)
      newRow.appendChild(newTd)
    })
    historyTbody.appendChild(newRow)
  })
}

function parseChartData(coin) {
  ajax({
    url: coinGecko.getVolumeCall(coin.id),
    cbSuccess: res => {
      ajax({
        url: coinGecko.getOhlcCall(coin.id),
        cbSuccess: data => {
          let totalVolumes = JSON.parse(JSON.stringify(res.total_volumes))
          let data_Ohlc = JSON.parse(JSON.stringify(data))
          data_Ohlc.pop()
          data_Ohlc.map(OHLC =>
            OHLC.push(totalVolumes.find(element => element[0] === OHLC[0])[1])
          )

          highchart(data_Ohlc, coin)
        }
      })
    }
  })
}

function highchart(data, coin) {
  // split the data set into ohlc and volume
  let ohlc = [],
    volume = [],
    dataLength = data.length,
    // set the allowed units for data grouping
    groupingUnits = [
      [
        'week', // unit name
        [1] // allowed multiples
      ],
      ['month', [1, 2, 3, 4, 6]]
    ],
    i = 0

  for (i; i < dataLength; i += 1) {
    ohlc.push([
      data[i][0], // the date
      data[i][1], // open
      data[i][2], // high
      data[i][3], // low
      data[i][4] // close
    ])

    volume.push([
      data[i][0], // the date
      data[i][5] // the volume
    ])
  }

  // create the chart
  Highcharts.stockChart('container', {
    rangeSelector: {
      selected: 1
    },
    chart: {
      styledMode: true
    },

    title: {
      text: coin.name
    },

    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }
    ],

    tooltip: {
      split: true
    },
    credits: {
      enabled: false
    },

    series: [
      {
        type: 'candlestick',
        name: coin.name,
        data: ohlc,
        dataGrouping: {
          units: groupingUnits
        }
      },
      {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits
        }
      }
    ]
  })
}

function placeOrder() {
  avblUsd()
  avblCoin()
  document.querySelectorAll('input[name]').forEach(input => {
    input.addEventListener('keyup', () => {
      const type = input.dataset.operation,
        name = input.name,
        names = ['quantity', 'total'],
        targetInput = document.querySelector(
          `input[name=${
            names[(names.indexOf(name) + 1) % 2]
          }][data-operation=${type}]`
        )
      name === 'quantity'
        ? (targetInput.value = input.value * getSelectedCoin().current_price)
        : (targetInput.value = input.value / getSelectedCoin().current_price)

      if (String(targetInput.value) === '0') {
        targetInput.value = ''
      }

      avblUsd()
      avblCoin()
    })
  })
}

function getSelectedCoin() {
  return coinObjects.find(
    coin =>
      coin.name === document.querySelector('.order-forms').dataset.selectedCoin
  )
}

function clearInputs() {
  document.querySelectorAll('input').forEach(input => {
    input.value = ''
  })
}

function avblUsd() {
  let avblUsdNode = document.querySelector('#avblUSD')
  avblUsdNode.innerHTML =
    getCurrentUser().wallet.cash -
    document.querySelector("[name='total'][data-operation='buy']").value
}

function avblCoin() {
  const avblCoinNode = document.querySelector('#avblCoin'),
    currentCoins = getCurrentUser().wallet.coins[getSelectedCoin().name] || 0

  avblCoinNode.innerHTML =
    currentCoins -
    document.querySelector("[name='quantity'][data-operation='sell']").value
}

// function printBalance(user) {
//   const balance = await getBalance(user)

//   document.querySelector('.usd-balance').innerHTML = balance
// }

async function getBalance(user) {
  const userCoinsIds = Object.keys(user.wallet.coins).map(name => getId(name)),
    idsForApiCall = userCoinsIds.join('%2C')

  ajax(
    {
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${idsForApiCall}&vs_currencies=usd`,
      cbSuccess: res => {
        const amountTimesPriceArray = Object.keys(user.wallet.coins).map(
          coinName => user.wallet.coins[coinName] * res[getId(coinName)]['usd']
        )
        const balance = [user.wallet.cash]
          .concat(amountTimesPriceArray)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )
        document.querySelector('.usd-balance').innerHTML = balance.toFixed(2)
      }
    },
    'noload'
  )
}

function requireAuth(user) {
  if (!user) {
    const body = document.querySelector('body'),
      main = document.querySelector('main'),
      modalBox = document.createElement('div'),
      modalMessage = document.createElement('div'),
      btnContainer = document.createElement('div'),
      btn = document.createElement('button'),
      span = document.createElement('span')

    main.classList.add('position-relative')

    body.style = 'overflow:hidden'

    modalBox.classList.add('modal-box')
    modalMessage.classList.add('modal-message')
    modalMessage.innerHTML =
      'You must be logged in to use the Snappier Trading simmulator'

    btnContainer.classList.add('d-grid', 'submit-box', 'mb-2')
    btnContainer.appendChild(btn)
    btn.appendChild(span)
    btn.setAttribute('href', '#/signin')
    span.innerHTML = 'Create Account'
    modalMessage.appendChild(btnContainer)

    modalBox.appendChild(modalMessage)
    main.insertBefore(modalBox, main.firstChild)

    document
      .querySelectorAll('[href], .modal-message button')
      .forEach(element =>
        element.addEventListener('click', () => {
          main.classList.remove('position-relative')
          body.setAttribute('style', '')
          modalBox.remove()
        })
      )
    btn.addEventListener('click', () => {
      location.hash = '#/signin'
    })
  }
}
