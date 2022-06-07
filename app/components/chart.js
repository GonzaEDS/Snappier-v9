import { coinObjects, User, usersList } from '../helpers/models.js'
import { ajax } from '../helpers/ajax.js'
import coinGecko from '../helpers/coinGeckoApi.js'
import { populateArray } from '../helpers/table.js'
import { getCurrentUser } from '../helpers/session.js'

const user = getCurrentUser()
export function chart() {
  if (!getCurrentUser()) {
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

  //   <div class="d-grid submit-box mb-2">
  //               <button type="submit">
  //                 <span>Create Account</span>
  //               </button>
  //             </div>
  //   if (getCurrentUser()) {
  //     document.querySelector('.modal-box').remove()

  //   }
  ajax({
    url: coinGecko.dashboard_call,
    cbSuccess: res => {
      populateArray(res, coinObjects)
      populateCoinsList(coinObjects)
      placeOrder()
      orderEvents()
      console.log(usersList)
      console.log(getCurrentUser())
      populateWallet(getCurrentUser())
      parseChartData(coinObjects[0])
    }
  })
}
function orderEvents() {
  document.querySelectorAll('.buySellButton').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault()
      const type = e.currentTarget.dataset.operation

      const selectedCoin = getSelectedCoin()

      const quantityInput = document.querySelector(
        `.orderForm-input[data-operation=${type}]`
      )

      const quantityInputValue = quantityInput.value

      const totalInput = document.querySelector(
        `input[name=total][data-operation=${type}]`
      )
      const totalInputValue = totalInput.value

      user.userOperation(
        type,
        selectedCoin,
        quantityInputValue,
        totalInputValue
      )

      populateWallet(user)
      //   update usersList
      usersList.splice(
        Number(localStorage.getItem('loged-user-id') - 1),
        1,
        user
      )
      //   save
      localStorage.setItem('users', JSON.stringify(usersList))
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

    // <tbody class="wallet-coins">
    // <tr>
    //     <td>
    //         <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579">
    //         <div>Bitcoin</div>
    //     </td>
    //     <td>
    //         29755
    //     </td>
    // </tr>
  })
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
      parseChartData(coin)
    })
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
  document.querySelectorAll('input[name=quantity]').forEach(input => {
    input.addEventListener('keyup', () => {
      const type = input.dataset.operation,
        totalInput = document.querySelector(
          `input[name=total][data-operation=${type}]`
        )
      totalInput.value = input.value * getSelectedCoin().current_price
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
