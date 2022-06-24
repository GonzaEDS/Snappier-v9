import { getUsersList, User } from './models.js'

export function isLoged() {
  if (localStorage.getItem('loged-user-id')) {
    return true
  } else {
    return false
  }
}

export function getCurrentUser() {
  const usersList = getUsersList(),
    currentUser =
      usersList[Number(localStorage.getItem('loged-user-id') - 1)] || null

  let toUser = null
  if (currentUser) {
    toUser = new User(
      currentUser.id,
      currentUser.name,
      currentUser.hashedPassword,
      currentUser.email
    )
    toUser.image = currentUser.image
    toUser.wallet = currentUser.wallet
    toUser.history = currentUser.history
  }
  return toUser
}
