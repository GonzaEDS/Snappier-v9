import { User, getUsersList } from '../helpers/models.js'
import { formErrorMessage, hash } from '../helpers/validation.js'

export function signIn() {
  const usersList = getUsersList()
  // 1- seleccionar nombre de usuario y contraseña
  document.querySelector('#signIn-form').addEventListener('submit', e => {
    e.preventDefault()

    const form = document.querySelector('form'),
      email = document.querySelector('input[type=email]').value,
      name = document.querySelector('input[name=name]').value,
      password = document.querySelector('input[name=password]').value,
      passwordConfirmation = document.querySelector(
        'input[name=password-confirmation'
      ).value

    if (name == '') {
      formErrorMessage(`Must include username`)
      return
    }
    if (password == '') {
      formErrorMessage(`Must include password`)
      return
    }
    if (email == '') {
      formErrorMessage(`Must include email`)
      return
    }
    if (passwordConfirmation != password) {
      formErrorMessage('Passwords do not match')
      return
    }
    if (password.length < 6) {
      formErrorMessage('Password must be 6 characters or longer ')
      return
    }
    if (usersList.some(user => user.name === name)) {
      formErrorMessage('That username is already taken')
      return
    }
    const hashedPassword = hash(password),
      id = usersList.length + 1
    usersList.push(new User(id, name, hashedPassword, email))
    localStorage.setItem('users', JSON.stringify(usersList))
    localStorage.setItem('loged-user-id', id)

    location.hash = '#/user'
  })
}
