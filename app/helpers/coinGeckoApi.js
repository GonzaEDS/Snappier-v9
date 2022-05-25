const API_DOMAIN = `https://api.coingecko.com/api/v3`
let vs_currency = 'usd',
  order = 'market_cap_desc',
  per_page = 250,
  sparkline = 'false',
  dashboard_call = `${API_DOMAIN}/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=1&sparkline=${sparkline}`

export default {
  dashboard_call
}
