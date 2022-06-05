//defines coins constructor
export class Coin {
  constructor(
    id,
    name,
    symbol,
    current_price,
    image,
    total_supply,
    ath,
    ath_change_percentage,
    circulating_supply,
    market_cap_rank,
    price_change_percentage_24h
  ) {
    this.id = id
    this.name = name
    this.symbol = symbol
    this.current_price = current_price
    this.image = image
    this.total_supply = total_supply
    this.ath = ath
    this.ath_change_percentage = ath_change_percentage
    this.circulating_supply = circulating_supply
    this.market_cap_rank = market_cap_rank
    this.price_change_percentage_24h = price_change_percentage_24h
  }
}

export class User {
  constructor(id, name, hashedPassword, email) {
    this.id = id
    this.email = email
    this.name = name
    this.hashedPassword = hashedPassword
    this.wallet = { cash: 10000, coins: {} }
    this.image = './app/assets/img/user.svg'
  }
  userOperation(type, coin, amount, price) {
    const coinsValue = amount * price,
      coinName = coin.name

    switch (type) {
      case 'buy':
        if (this.wallet['cash'] < Number(price)) {
          console.log('invalid operation')
          return 'invalid operation'
        } else {
          this.wallet['cash'] -= Number(price)
          if (this.wallet.coins.hasOwnProperty(coinName)) {
            this.wallet.coins[coinName] += Number(amount)
          } else {
            console.log(coinName)
            this.wallet.coins[coinName] = Number(amount)
          }
          return 'operation successfull'
        }
      case 'sell':
        if (
          this.wallet.coins.hasOwnProperty(coinName) == false ||
          this.wallet.coins[coinName] < Number(amount)
        ) {
          return 'invalid operation'
        } else {
          this.wallet.coins[coinName] -= Number(amount)
          if (this.wallet.coins[coinName] === 0) {
            delete this.wallet.coins[coinName]
          }
          this.wallet['cash'] += Number(price)
        }
    }
  }
}

export const usersList = JSON.parse(localStorage.getItem('users') || '[]')

export const coinObjects = []
