import { getCurrentUser } from '../helpers/session.js'
import { getUsersList } from '../helpers/models.js'
import { coinSymbols } from '../helpers/coins-symbols.js'
import { ajax } from '../helpers/ajax.js'
import { hash } from '../helpers/validation.js'

export function User() {
  let usersList = getUsersList()
  const user = getCurrentUser(),
    displayName = document.querySelector('#name'),
    displayEmail = document.querySelector('#email'),
    displayPassword = document.querySelector('#password'),
    leftUsername = document.querySelector('.user-card h2'),
    // userImg = document.querySelector('.user-page-img'),
    userImg = document.querySelector('.user-img'),
    logOutBtn = document.querySelector('#logout'),
    editImgBtn = document.querySelector('.edit-img'),
    editDataBtn = document.querySelector('.edit-data'),
    hiddenPasswordStr = Array.from(`${user.hashedPassword}`)
      .map(i => '*')
      .join('')

  displayName.innerHTML = user.name
  leftUsername.innerHTML = user.name
  displayEmail.innerHTML = user.email
  displayPassword.innerHTML = hiddenPasswordStr
  userImg.style = `background-image: url(${user.image})`

  // console.log(user.hashedPassword)
  // console.log(
  //   Array.from(`${user.hashedPassword}`)
  //     .map(i => '*')
  //     .join('')
  // )

  editImgBtn.addEventListener('click', () => {
    const changeImgInput = document.createElement('input'),
      // changeImgLabel = document.createElement('label'),
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
    changeImgInput.classList.add('form-control')
    changeImgInput.placeholder = 'Introduce an image URL and press Enter:'
    // changeImgLabel.innerHTML = 'Introduce an URL for your new image:'
    // changeImgContainer.appendChild(changeImgLabel)
    changeImgContainer.appendChild(changeImgInput)

    document.querySelector('.user-card').appendChild(changeImgContainer)
    changeImgInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        console.log(changeImgInput.value)
        usersList[user.id - 1].image = changeImgInput.value
        localStorage.setItem('users', JSON.stringify(usersList))
        usersList = getUsersList()
        console.log(getUsersList())
        console.log(getCurrentUser())

        changeImgContainer.remove()
        console.log(getCurrentUser().image)
        userImg.style = `background-image: url(${getCurrentUser().image})`
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

  editDataBtn.addEventListener('click', () => {
    //show edit buttons

    document.querySelectorAll('.edit-this-btn').forEach(btn => {
      btn.style.display == 'none'
        ? (btn.style.display = 'inline-block')
        : (btn.style.display = 'none')

      btn.addEventListener('click', e => {
        // if(e.target.parentNode.nextSibling)
        console.log(e.target.parentNode.dataset)
        if (e.target.parentNode.nextSibling.nodeType !== 1) {
          if (document.querySelector('.edit-input-container')) {
            document.querySelector('.edit-input-container').remove()
          }
          const inputContainer = document.createElement('form'),
            inputWrapper = document.createElement('div'),
            userDataType = e.target.parentNode.dataset.userInfo,
            input = document.createElement('input'),
            liElement = e.target.parentNode,
            saveBtn = document.createElement('button'),
            closeBtn = document.createElement('i')

          inputWrapper.classList.add('display-flex', 'flex-column')
          inputWrapper.style.width = '100%'

          inputContainer.classList.add('edit-input-container')
          input.placeholder = `Insert new ${userDataType}`
          input.required = true
          input.classList.add('form-control')

          saveBtn.type = 'submit'
          saveBtn.innerHTML = 'Save'
          saveBtn.classList.add('btn', 'btn-rounded', 'btn-primary', 'save-btn')

          closeBtn.classList.add('fa-solid', 'fa-rectangle-xmark')
          closeBtn.style.marginRight = '1rem'
          let currentPassword

          switch (userDataType) {
            case 'password':
              input.type = 'password'
              currentPassword = document.createElement('input')
              currentPassword.type = 'password'
              currentPassword.placeholder = 'Insert current password'
              currentPassword.classList.add('form-control')
              currentPassword.style.marginBottom = '0.7rem'
              inputWrapper.appendChild(currentPassword)
              break
            case 'email':
              input.type = 'email'
              break
          }

          inputWrapper.appendChild(input)

          inputContainer.appendChild(inputWrapper)
          inputContainer.appendChild(saveBtn)
          inputContainer.appendChild(closeBtn)
          insertAfter(inputContainer, liElement)

          saveBtn.addEventListener('click', e => {
            e.preventDefault
            // const inputValue = e.target.parentNode.children[0].children[0].value
            const inputValue = input.value
            if (inputValue.length > 0) {
              switch (userDataType) {
                case 'name':
                  saveAndPrint(e, inputValue, userDataType)
                  document.querySelector('.user-card h2').innerHTML = inputValue
                  break

                case 'password':
                  const currentPasswordValue = currentPassword.value,
                    hashedCurrentPassword = hash(currentPasswordValue)

                  if (hashedCurrentPassword != user.hashedPassword) {
                    return 'Wrong Current Password'
                  }
                  if (inputValue.length < 6) {
                    return 'New Password should have at least 6 characters'
                  }

                  user['hashedPassword'] = hashedCurrentPassword
                  //   update usersList
                  usersList.splice(
                    Number(localStorage.getItem('loged-user-id') - 1),
                    1,
                    user
                  )
                  //   save
                  localStorage.setItem('users', JSON.stringify(usersList))
                  //reflect on dom
                  hiddenPasswordStr = Array.from(`${user.hashedPassword}`)
                    .map(i => '*')
                    .join('')

                  e.target.parentNode.previousSibling.children[0].children[1].innerHTML =
                    hiddenPasswordStr

                  break
                case 'email':
                  let emailRgxVal = /^[^@]+@[^@]+\.[^@]+$/
                  if (emailRgxVal.test(inputValue)) {
                    console.log(inputValue)
                    saveAndPrint(e, inputValue, userDataType)
                  }
                  break
              }
            }
          })
          function saveAndPrint(event, input, datatype) {
            //update user
            user[`${datatype}`] = input
            //   update usersList
            usersList.splice(
              Number(localStorage.getItem('loged-user-id') - 1),
              1,
              user
            )
            //   save
            localStorage.setItem('users', JSON.stringify(usersList))
            //reflect on dom
            event.target.parentNode.previousSibling.children[0].children[1].innerHTML =
              user[`${datatype}`]
          }

          closeBtn.addEventListener('click', e => {
            e.target.parentNode.remove()
          })

          function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(
              newNode,
              existingNode.nextSibling
            )
          }
        }
      })
    })
  })

  logOutBtn.addEventListener('click', () => {
    localStorage.removeItem('loged-user-id')
    location.hash = '#/login'
  })

  myPortfolio(getCurrentUser())

  // console.log(getColorFromSymbol('Bitcoin'))

  // Register the legend plugin
  const plugin = {
    beforeInit(chart) {
      // Get reference to the original fit function
      const originalFit = chart.legend.fit

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)()
        // Change the height as suggested in another answers
        this.height += 15
      }
    }
  }

  function myPortfolio(user) {
    const userCoinsIds = Object.keys(user.wallet.coins).map(name =>
        getId(name)
      ),
      idsForApiCall = userCoinsIds.join('%2C')
    // console.log(idsForApiCall)

    ajax({
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${idsForApiCall}&vs_currencies=usd`,
      cbSuccess: res => {
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
          data: data,
          plugins: [plugin]
        }

        const myChart = new Chart(
          document.getElementById('portfolio-chart'),
          config
        )
      }
    })
  }

  // console.log('user')
}

function getColorFromSymbol(coinName) {
  const symbol = getSymbol(coinName),
    symbolArray = symbol.split(''),
    valuesArray = symbolArray.map(letter => letter.charCodeAt(0))
  let indexValue = Object.keys(getCurrentUser().wallet.coins).indexOf(coinName)

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
  // let r = symbol[0].charCodeAt(0)
  // r % 2 == 0 ? (r += 75) : (r -= 65)
  // let g = symbol[1].charCodeAt(0)
  // g % 2 == 0 ? (g += 75) : (g -= 65)
  // let b = symbol[2].charCodeAt(0)
  // b % 2 == 0 ? (b += 75) : (b -= 65)
  // g - b > 10 ? (b += 65) : (b += 10)
  // return `rgb(${r},${g},${b})`
  // let h = (valuesArray.reduce((a, b) => a + b, 100) + 10) % 356
  // h % 2 === 0 ? (h += 30) : (h -= 30)
  const numOfCoins = Object.keys(getCurrentUser().wallet.coins).length
  let ratio = 360 / numOfCoins
  // console.log(
  //   coinName +
  //     ' ' +
  //     indexValue +
  //     ' ' +
  //     '+1' +
  //     '*' +
  //     ratio +
  //     `hsl(${indexValue * ratio}deg 80% 57%)`
  // )

  return `hsl(${(indexValue * ratio + 33) % 360}deg 70% 50%)`
}

function getSymbol(coinNameInput) {
  const coin = coinSymbols.find(coin => coin.name == coinNameInput)
  return coin.symbol
}

export function getId(coinNameInput) {
  const coin = coinSymbols.find(coin => coin.name == coinNameInput)
  return coin.id
}
