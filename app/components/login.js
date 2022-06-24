import { getUsersList } from '../helpers/models.js'
import { formErrorMessage, hash } from '../helpers/validation.js'

export function logIn() {
  const usersList = getUsersList()
  const form = document.querySelector('form')

  document
    .querySelector('.demo-account-check')
    .addEventListener('change', () => {
      const demoUserName = 'Demo User',
        demoUserPassword = '123456',
        nameInput = document.querySelector('input[name=name]'),
        passwordInput = document.querySelector('input[name=password]'),
        nameInputValue = nameInput.value,
        passwordInputValue = passwordInput.value

      nameInputValue == demoUserName && passwordInputValue == demoUserPassword
        ? form.reset()
        : setDemoData()

      function setDemoData() {
        document.querySelector('input[name=name]').value = 'Demo User'
        document.querySelector('input[name=password]').value = '123456'
      }
    })
  document.querySelector('#logIn-form').addEventListener('submit', e => {
    const name = document.querySelector('input[name=name]').value,
      password = hash(document.querySelector('input[name=password]').value)

    e.preventDefault()

    if (usersList[0] == null) {
      formErrorMessage('That username does not exists')
      return
    }

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

    location.hash = '#/user'
  })
}
