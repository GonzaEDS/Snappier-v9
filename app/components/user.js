import { getCurrentUser } from '../helpers/session.js'
import { usersList } from '../helpers/models.js'

export function User() {
  const user = getCurrentUser(),
    displayName = document.querySelector('#name'),
    displayEmail = document.querySelector('#email'),
    displayPassword = document.querySelector('#password'),
    leftUsername = document.querySelector('.user-card h2'),
    userImg = document.querySelector('.user-page-img'),
    logOutBtn = document.querySelector('#logout'),
    editImgBtn = document.querySelector('.edit-img'),
    hiddenPasswordStr = Array.from(`${user.hashedPassword}`)
      .map(i => '*')
      .join('')

  displayName.innerHTML = user.name
  leftUsername.innerHTML = user.name
  displayEmail.innerHTML = user.email
  displayPassword.innerHTML = hiddenPasswordStr
  userImg.src = user.image

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

  console.log('user')
}
