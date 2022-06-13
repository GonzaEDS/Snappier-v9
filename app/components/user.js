import { getCurrentUser } from '../helpers/session.js'
import { usersList } from '../helpers/models.js'
import { coinSymbols } from '../helpers/coins-symbols.js'
import { ajax } from '../helpers/ajax.js'

export function User() {
  const user = getCurrentUser(),
    displayName = document.querySelector('#name'),
    displayEmail = document.querySelector('#email'),
    displayPassword = document.querySelector('#password'),
    leftUsername = document.querySelector('.user-card h2'),
    // userImg = document.querySelector('.user-page-img'),
    userImg = document.querySelector('.user-img'),
    logOutBtn = document.querySelector('#logout'),
    editImgBtn = document.querySelector('.edit-img'),
    hiddenPasswordStr = Array.from(`${user.hashedPassword}`)
      .map(i => '*')
      .join('')

  displayName.innerHTML = user.name
  leftUsername.innerHTML = user.name
  displayEmail.innerHTML = user.email
  displayPassword.innerHTML = hiddenPasswordStr
  userImg.style = `background-image: url(${user.image})`

  console.log(user.hashedPassword)
  console.log(
    Array.from(`${user.hashedPassword}`)
      .map(i => '*')
      .join('')
  )

  editImgBtn.addEventListener('click', () => {
    const changeImgInput = document.createElement('input'),
      changeImgLabel = document.createElement('label'),
      changeImgContainer = document.createElement('div'),
      submit = document.createElement('input')

    submit.type = 'submit'
    changeImgContainer.classList.add(
      'change-img-popup',
      'p-2',
      'd-flex',
      'flex-column',
      'gap-2'
    )
    changeImgLabel.innerHTML = 'Introduce an URL for your new image:'
    changeImgContainer.appendChild(changeImgLabel)
    changeImgContainer.appendChild(changeImgInput)

    document.querySelector('.user-card').appendChild(changeImgContainer)
    changeImgInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        console.log(changeImgInput.value)
        usersList[user.id - 1].image = changeImgInput.value
        localStorage.setItem('users', JSON.stringify(usersList))
        changeImgContainer.remove()
        User()
      }
    })

    // close clicking outside
    setInterval(() => {
      document.addEventListener('click', function handleClickOutsideBox(event) {
        if (!changeImgContainer.contains(event.target)) {
          changeImgContainer.remove()
        }
      })
    }, 1)
  })

  logOutBtn.addEventListener('click', () => {
    localStorage.removeItem('loged-user-id')
    location.hash = '#/login'
  })

  myPortfolio(getCurrentUser())

  // console.log(getColorFromSymbol('Bitcoin'))

  function myPortfolio(user) {
    const userCoinsIds = Object.keys(user.wallet.coins).map(name =>
        getId(name)
      ),
      idsForApiCall = userCoinsIds.join('%2C')
    console.log(idsForApiCall)

    ajax({
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${idsForApiCall}&vs_currencies=usd`,
      cbSuccess: res => {
        console.log(res)
        console.log(getSymbol('Cosmos Hub'))
        console.log(getSymbol('Lido Staked Ether'))
        console.log(getColorFromSymbol('Cosmos Hub'))
        console.log(getColorFromSymbol('Lido Staked Ether'))
        console.log(Object.values(res))
        console.log(Object.values(user.wallet.coins))
        const amountTimesPriceArray = Object.keys(user.wallet.coins).map(
          coinName => user.wallet.coins[coinName] * res[getId(coinName)]['usd']
        )
        const assets = Object.keys(user.wallet.coins)
        assets.unshift('Cash')
        const data = {
          labels: assets,
          datasets: [
            {
              label: 'Portfolio distribution',
              data: [user.wallet.cash].concat(amountTimesPriceArray),
              backgroundColor: ['rgb(72 124 66)'].concat(
                Object.keys(user.wallet.coins).map(coin =>
                  getColorFromSymbol(coin)
                )
              ),
              hoverOffset: 4
            }
          ]
        }

        const config = {
          type: 'doughnut',
          data: data
        }
        const myChart = new Chart(
          document.getElementById('portfolio-chart'),
          config
        )
      }
    })
  }

  console.log('user')
}

function getColorFromSymbol(coinName) {
  const symbol = getSymbol(coinName),
    symbolArray = symbol.split('')
  // let rgbColor = 'rgb('
  // symbolArray.forEach((letter, index) => {
  //   letter.charCodeAt(0) % 2 === 0
  //     ? (rgbColor += letter.charCodeAt(0) + 65)
  //     : (rgbColor += letter.charCodeAt(0) - 55)
  //   index !== 2 ? (rgbColor += ',') : (rgbColor += ')')
  // })
  // for (let i = 0; i < 3; i++) {
  //   symbolArray[i].charCodeAt(0) % 2 === 0
  //     ? (rgbColor += symbolArray[i].charCodeAt(0) + 75)
  //     : (rgbColor += symbolArray[i].charCodeAt(0) - 65)
  //   i !== 2 ? (rgbColor += ',') : (rgbColor += ')')
  // }
  // return rgbColor
  let r = symbol[0].charCodeAt(0)
  r % 2 == 0 ? (r += 75) : (r -= 65)
  let g = symbol[1].charCodeAt(0)
  g % 2 == 0 ? (g += 75) : (g -= 65)
  let b = symbol[2].charCodeAt(0)
  b % 2 == 0 ? (b += 75) : (b -= 65)
  g - b > 10 ? (b += 65) : (b += 10)
  return `rgb(${r},${g},${b})`
}

function getSymbol(coinNameInput) {
  const coin = coinSymbols.find(coin => coin.name == coinNameInput)
  return coin.symbol
}

function getId(coinNameInput) {
  const coin = coinSymbols.find(coin => coin.name == coinNameInput)
  return coin.id
}
