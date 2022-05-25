import { usersList } from '../helpers/models.js'

export function testPage() {
  console.log('Hello World')
  const main = document.querySelector('main')
  const container = document.createElement('div')
  container.classList.add(
    'container',
    'px-5',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'gap-5'
  )
  main.appendChild(container)
  const image1 = document.createElement('img')
  image1.src = usersList[0].image
  image1.style = `width: 9rem;
  background: #375a7f;
  border-radius: 50%;`
  container.appendChild(image1)
  const name = document.createElement('h1')
  name.innerHTML = usersList[0].name
  container.appendChild(name)
}
