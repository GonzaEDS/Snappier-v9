import { usersList } from '../helpers/models.js'
import { formErrorMessage } from '../helpers/validation.js'

export function logIn() {
  document.querySelector('#logIn-form').addEventListener('submit', e => {
    e.preventDefault()

    if (usersList[0] == null) {
      formErrorMessage('That username does not exists')
      return
    }

    const form = document.querySelector('form'),
      name = document.querySelector('input[name=name]').value,
      password = document.querySelector('input[name=password]').value
    console.log(password)

    if (!usersList.some(user => user.name == name)) {
      formErrorMessage('That username does not exists')
      return
    }

    if (
      usersList.find(user => user.name === name).hashedPassword !== password
    ) {
      formErrorMessage('Wrong Password')
      return
    }
    let id = usersList.find(user => user.name === name).id
    localStorage.setItem('loged-user-id', id)
    location.hash = ''
  })
}
