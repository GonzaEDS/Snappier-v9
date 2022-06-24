# Snappier - Tranding Simulator.

![Snappier](https://github.com/GonzaEDS/Snappier-v9/blob/master/app/assets/img/snappier.svg)

Hi! This is a capstone project and a personal exploration of the possibilities offered by JavaScript.
**Snappier** is a *cryptocurrency trading simulator* that allows you to build a portfolio and track its performance over time.


***
### USAGE:
> * When you enter the application you will see the **Dashboard**. There is a table there with information about all currencies. By clicking on a row you will access a price calculator and a detailed description about the currency

> * The main feature of the app is the **Trading simulator** which is accessed from the navigation bar. It is required to create an account to use it (you can use the 'demo account' option on the login page).

> * The trading simulator allows you to buy and sell coins with a starting amount of 10,000 USD.

> * On the my account page you can see the distribution of your portfolio and edit your personal information.

> * For more details you can watch a quick demo video in the [About this site](https://gonzaeds.github.io/Snappier-v9/#/about) section.

***

### IMPLEMENTATION DETAILS 
>* It is a Single Page Application. It implements a router that imports the views according to the route in a single HTML file, without using frameworks.
>* Uses multiple enpoints from the CoinGecko API. Sometimes combining two and processing the information to complete a task.
>* Implements models based on javascript data structures. Classes for Coins and Users are used to build objects that are stored in arrays.
>* Uses modern ES6 syntax to manipulate classes and arrays and declare functions
database logo Uses locale storage as a database. Each User has a Wallet and a Transactions Record, besides his personal information, and all this is kept in locale storage.
>* In this way, an authentication and session system is also implemented. Some parts of the application are only accessible to users. The application recognizes which user has logged in and displays information accordingly.
>* Uses the libraries **Highcharts** and **Chart.js** to render interactive charts based on the information stored in its database or received from the API.

***
[CODE](https://github.com/GonzaEDS/Snappier-v9/tree/master/app) - [DEMO](https://gonzaeds.github.io/Snappier-v9/)