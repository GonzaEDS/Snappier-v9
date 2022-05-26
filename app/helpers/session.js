import { usersList } from './models.js'

export function isLoged() {
  if (localStorage.getItem('loged-user-id')) {
    return true
  } else {
    return false
  }
}

export function getCurrentUser() {
  const currentUser =
    usersList[Number(localStorage.getItem('loged-user-id') - 1)] || null
  return currentUser
}
