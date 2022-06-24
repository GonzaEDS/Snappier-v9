import { addLoader, removeLoader } from './loader.js'

export async function ajax(props, noload) {
  let { url, cbSuccess } = props
  if (!noload) {
    addLoader()
  }

  try {
    const response = await fetch(url)
    const data = await response.json()
    cbSuccess(data)
    removeLoader()
  } catch (error) {
    let message = error.statusText || 'Ocurrió un error al acceder a la API'
    console.log(`${error.status}: ${message} `)
  }
}
