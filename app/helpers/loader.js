const loader1 = `<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
<path fill="#375a7f" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
  <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="0.5s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
</path>
</svg>`,
  loader2 = `<svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
<circle fill="none" stroke="#fff" stroke-width="4" cx="50" cy="50" r="44" style="opacity:0.5;"></circle>
  <circle fill="#fff" stroke="#375a7f" stroke-width="3" cx="8" cy="54" r="6">
    <animateTransform attributeName="transform" dur="2s" type="rotate" from="0 50 48" to="360 50 52" repeatCount="indefinite" style=""></animateTransform>
    
  </circle>
</svg>`

export function addLoader() {
  const loader = document.createElement('div')
  loader.classList.add('loader')
  loader.innerHTML = loader1
  document.querySelector('.addLoader').appendChild(loader)
}

export function removeLoader() {
  document.querySelector('.loader').remove()
}
