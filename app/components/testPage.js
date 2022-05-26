import { usersList } from '../helpers/models.js'
import { Navigation } from './navigation.js'

export function testPage() {
  let logedUserIndex

  localStorage.getItem('loged-user-id') == null
    ? (logedUserIndex = null)
    : (logedUserIndex = Number(localStorage.getItem('loged-user-id') - 1))

  const main = document.querySelector('main')

  const previous = document.querySelector('#testDiv')
  if (previous) {
    previous.remove()
  }
  const container = document.createElement('div')
  container.classList.add(
    'container',
    'px-5',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'gap-5',
    'flex-column'
  )
  container.id = 'testDiv'
  main.appendChild(container)
  const image1 = document.createElement('img')
  const noImg =
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

  let imageSrc = noImg
  let userNameText = 'No User'

  if (usersList[logedUserIndex]) {
    imageSrc = usersList[logedUserIndex].image
    userNameText = usersList[logedUserIndex].name
  }

  image1.src = imageSrc
  image1.style = `width: 9rem;
  background: #375a7f;
  border-radius: 50%;`
  container.appendChild(image1)
  const name = document.createElement('h1')
  name.innerHTML = userNameText
  container.appendChild(name)
  // clear storage
  const clearStorage = document.createElement('button')
  clearStorage.innerHTML = 'Clear Storage'
  clearStorage.classList.add('btn', 'btn-primary')
  container.appendChild(clearStorage)
  clearStorage.addEventListener('click', () => {
    localStorage.clear()
  })

  //   log out
  const logOut = document.createElement('button')
  logOut.innerHTML = 'Log Out'
  logOut.classList.add('btn', 'btn-danger')
  container.appendChild(logOut)

  logOut.addEventListener('click', () => {
    localStorage.removeItem('loged-user-id')
    Navigation()
    testPage()
  })
}
