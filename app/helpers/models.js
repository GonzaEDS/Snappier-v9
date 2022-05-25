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
    market_cap_rank
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
  }
}

export class User {
  constructor(id, name, hashedPassword, email) {
    this.id = id
    this.email = email
    this.name = name
    this.hashedPassword = hashedPassword
    this.wallet = { cash: 10000 }
    this.logedIn = true
    this.image = './app/assets/img/user.svg'
  }
  operation(type, coin, amount, price) {
    const coinsValue = amount * price

    switch (type) {
      case 'buy':
        if (this.wallet['cash'] < coinsValue) {
          return 'invalid operation'
        } else {
          this.wallet['cash'] -= coinsValue
          if (this.wallet.hasOwnProperty(coin)) {
            this.wallet[coin] += amount
          } else {
            this.wallet[coin] = amount
          }
          return 'operation successfull'
        }
      case 'sell':
        if (
          this.wallet.hasOwnProperty(coin) == false ||
          this.wallet[coin] < amount
        ) {
          return 'invalid operation'
        } else {
          this.wallet[coin] -= amount
          this.wallet['cash'] += coinsValue
        }
    }
  }
}

export const usersList = JSON.parse(localStorage.getItem('users') || '[]')

export const coinObjects = []
