import { usersList, User } from './models.js'

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

  let toUser = null
  if (currentUser) {
    toUser = new User(
      currentUser.id,
      currentUser.name,
      currentUser.hashedPassword,
      currentUser.email
    )
    toUser.wallet = currentUser.wallet
  }
  // let personFromStorage = JSON.parse(localStorage.getItem('person')) as Person;

  // let person = new Person('');
  // Object.assign(person , personFromStorage);
  return toUser
}
