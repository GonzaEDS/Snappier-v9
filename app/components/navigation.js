import { usersList } from '../helpers/models.js'
import { isLoged, getCurrentUser } from '../helpers/session.js'

export function Navigation() {
  const faUserIcon = '<i class="fa-solid fa-circle-user"></i>'
  const sessionNavLink = document.querySelector('#session-nav-link')
  switch (isLoged()) {
    case true:
      const currentUser = getCurrentUser()
      sessionNavLink.innerHTML = `${faUserIcon} ${currentUser.name}`
      sessionNavLink.href = '#/user'
      break
    case false:
      sessionNavLink.innerHTML = 'Login'
      sessionNavLink.href = '#/login'
  }
}
