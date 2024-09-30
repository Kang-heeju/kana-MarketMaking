# kanaMMbot

kanaMMbot is a **market-making bot** for **kana exchange**, designed to automate trading by providing liquidity in the order book and profiting through spreads.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [How to Run](#how-to-run)
3. [Strategy and Logic Overview](#strategy-and-logic-overview)
4. [Dependencies](#dependencies)

---

## Folder Structure

```
kana-MarketMaking/
├── src/                # Source code
│   ├── strategy.ts     # Trading strategies files
│   ├── interfaces/     # Interfaces and tools
│   ├── client/         # Exchange API client class
│   ├── main.ts         # Main execution file
│   └── config.ts       # Configuration files (API keys, environment variables, etc.)
├── tests/              # Test code
├── README.md           # README file
├── .env                # Environment variables file
└── package.json        # Dependency and script management file
```

---

## How to Run

1. **Install Dependencies**

   ```bash
     npm install

   ```

2. **Update Configuration File**
   • Navigate to the config/ folder and update the environment variable file (.env or similar) with the following settings:
   • Exchange API Key
   • API Secret
   • Other necessary configurations (e.g., base currency, trading pair)
3. **Run the Program**
   • To start the bot in production mode, run:
   ```bash
   npm start
   ```

## Strategy and Logic Overview

### Market-Making Strategy

kanaMMbot implements a **market-making** strategy, which involves placing buy and sell orders at different prices to capture the spread between the bid (buy) and ask (sell) prices. The bot provides liquidity to the exchange and earns small profits from the price differences between these orders.

- **Key Strategy Components:**
  - **Spread Management:** The bot continuously monitors the bid/ask prices and adjusts orders to maintain an optimal spread for profit generation.
  - **Order Placement Frequency:** Orders are periodically placed, modified, or canceled based on the market conditions and current order book status.
  - **Risk Management:** The bot adapts to market volatility by adjusting order sizes and prices to limit potential losses, ensuring a controlled risk environment.

### Logic Overview

1. **Market Data Collection**

   - The bot fetches real-time data from the kana exchange API, including price, volume, and order book depth.

2. **Order Creation and Placement**

   - Based on the collected data, the bot generates buy and sell orders and places them on the exchange with appropriate pricing relative to the current spread.

3. **Order Monitoring and Adjustment**

   - Orders are actively monitored to check if they are filled. If they are not filled within a specified time, the bot adjusts or cancels them based on updated market conditions.

4. **Profit Calculation and Strategy Adjustment**
   - The bot tracks filled orders, calculates the profit from the completed trades, and adjusts the market-making strategy if necessary, either by modifying the spread or changing the order placement frequency to maximize profitability.
