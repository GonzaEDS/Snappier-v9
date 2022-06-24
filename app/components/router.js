import { dashboard } from './dashboard.js'
import { logIn } from './login.js'
import { signIn } from './signIn.js'
import { testPage } from './testPage.js'
import { User } from './user.js'
import { chart } from './chart.js'
import { about } from './about.js'

export function Router() {
  let { hash } = location
  const htmlDashboard = './app/views/dashboard.html',
    htmlLogin = './app/views/login.html',
    htmlSignIn = './app/views/signin.html',
    htmlUser = './app/views/user.html',
    htmlTestPage = './app/views/testpage.html',
    htmlChart = './app/views/tradingsim.html',
    htmlAbout = './app/views/about.html'

  switch (hash) {
    case '':
      htmlRequest(htmlDashboard, dashboard)
      break
    case '#/login':
      htmlRequest(htmlLogin, logIn)
      break
    case '#/signin':
      htmlRequest(htmlSignIn, signIn)
      break
    case '#/testpage':
      htmlRequest(htmlTestPage, testPage)
      break
    case '#/user':
      htmlRequest(htmlUser, User)
      break
    case '#/tradingsim':
      htmlRequest(htmlChart, chart)
      break
    case '#/about':
      htmlRequest(htmlAbout, about)
      break
    default:
      htmlRequest(htmlDashboard, dashboard)
      break
  }
}

function htmlRequest(route, callback) {
  const main = document.querySelector('main')
  main.innerHTML = null
  let xhr = new XMLHttpRequest()
  xhr.open('GET', route)
  xhr.onload = async () => {
    main.innerHTML = await xhr.responseText
    callback()
  }
  xhr.send()
}
