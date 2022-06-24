import { formatDate } from './history.js'
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
    this.history = []
  }
  userOperation(type, coin, amount, price) {
    const coinName = coin.name

    switch (type) {
      case 'buy':
        if (this.wallet['cash'] < price || amount === 0) {
          console.log('invalid operation')
          return 'Invalid operation'
        } else {
          this.wallet['cash'] -= Number(price)
          if (this.wallet.coins.hasOwnProperty(coinName)) {
            this.wallet.coins[coinName] += amount
          } else {
            console.log(coinName)
            this.wallet.coins[coinName] = amount
          }
          break
        }
      case 'sell':
        if (
          this.wallet.coins.hasOwnProperty(coinName) == false ||
          this.wallet.coins[coinName] < Number(amount) ||
          amount === 0
        ) {
          return 'Invalid operation'
        } else {
          this.wallet.coins[coinName] -= Number(amount)
          if (this.wallet.coins[coinName] === 0) {
            delete this.wallet.coins[coinName]
          }
          this.wallet['cash'] += Number(price)
        }
    }
    //record operation
    this.history.push(
      new OperationRecord(
        new Date(),
        coin.name,
        coin.symbol,
        type,
        amount,
        coin.current_price,
        price
      )
    )
    return 'Successful operation'
  }
}

export class OperationRecord {
  constructor(
    time,
    coinName,
    coinSymbol,
    type,
    amount,
    price_unit,
    price_total
  ) {
    this.time = time
    this.coinName = coinName
    this.coinSymbol = coinSymbol
    this.type = type
    this.amount = amount
    this.price_unit = price_unit
    this.price_total = price_total
  }
}

export function getUsersList() {
  return JSON.parse(
    localStorage.getItem('users') ||
      '[{"id": 1,"email": "Demo@example.com", "name": "Demo User", "hashedPassword": 1450575459, "wallet": { "cash": 10000, "coins": {}}, "image": "./app/assets/img/user.svg", "history": []}]'
  )
}

export const coinObjects = []

export function getAmountTimesPriceArray(user, coinsData) {
  return Object.keys(user.wallet.coins).map(
    coinName => user.wallet.coins[coinName] * coinsData[getId(coinName)]['usd']
  )
}
