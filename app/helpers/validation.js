export function formErrorMessage(content) {
  const form = document.querySelector('form')
  const alert = document.createElement('div')
  alert.classList.add(
    'alert',
    'alert-danger',
    'alert-dismissible',
    'fade',
    'show',
    'py-2'
  )
  if (!document.querySelector('.alert-danger')) {
    const message = document.createTextNode(`${content}`)
    const close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.setAttribute('data-bs-dismiss', 'alert')
    close.setAttribute('aria-label', 'Close')
    close.classList.add('btn-close', 'py-3', 'close-btn-adjust')
    alert.appendChild(message)
    alert.appendChild(close)
    form.appendChild(alert)
  }
}
