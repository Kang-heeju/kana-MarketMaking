// import { AptosAccount, AptosClient } from "aptos";
// import {
//   BUY,
//   SELL,
//   ENVIRONMENT,
//   EconiaMarkets,
//   EconiaTrade,
//   RegisteredMarket,
//   TradeTable,
//   eventId,
//   subscribeEvents,
// } from "@kanalabs/trade";
// import { TradeEventEmitter, tradeEventEmitter } from "@kanalabs/trade";

// import * as dotenv from "dotenv";
// import { waitHelper } from "./waitHelper";
// dotenv.config();

// export const aptosClient = new AptosClient(
//   "https://fullnode.mainnet.aptoslabs.com/v1"
// );

// export const account = AptosAccount.fromAptosAccountObject({
//   address: process.env.APTOS_ADDRESS,
//   privateKeyHex: process.env.APTOS_PRIVATEKEY || "",
// });

// const orderBook = async () => {
//   const econia = new EconiaTrade(aptosClient);
//   let registeredMarkets: RegisteredMarket[] = [];
//   let marketData: EconiaMarkets;
//   registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.MAINNET); //tested
//   marketData = await econia.markets(
//     registeredMarkets.filter((market) => market.marketId == 7)[0],
//     ENVIRONMENT.MAINNET
//   );
//   console.log(marketData);
//   // Example usage
//   //   const tradeHistory = await marketData.getAllTrades();
// };
// // orderBook();

// const tradeHistory = async () => {
//   const econia = new EconiaTrade(aptosClient);
//   let registeredMarkets: RegisteredMarket[] = [];
//   let marketData: EconiaMarkets;

//   registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.TESTNET); //tested
//   marketData = await econia.markets(
//     registeredMarkets.filter((market) => market.marketId == 3)[0],
//     ENVIRONMENT.TESTNET
//   );
//   // // Example usage`
//   const myObject = new TradeEventEmitter(marketData);

//   await myObject.triggerTradeHistory();

//   //To unsubscribe events
//   setTimeout(() => {
//     myObject.terminateOrderHistoryEvent();
//   }, 100000); // Stop after 5 seconds
// };
// // tradeHistory();

// const getAvailableMarkets = async () => {
//   const econia = new EconiaTrade(aptosClient);
//   const registeredMarkets = await econia.fetchRegisteredMarkets(
//     ENVIRONMENT.MAINNET
//   );
//   console.log(registeredMarkets);
//   const availableMarkets = await econia.getAvailableMarkets(registeredMarkets);
//   console.log(availableMarkets);
//   //   const myObject = new TradeEventEmitter(availableMarkets);
//   //   await myObject.triggerToOrderBook();
//   //   //To unsubscribe events
//   //   setTimeout(() => {
//   //     myObject.terminateOrderBookEvent();
//   //   }, 20000); // Stop after 5 seconds
// };
// // getAvailableMarkets();

// const placeLimitOrder = async () => {
//   const econia = new EconiaTrade(aptosClient);
//   let registeredMarkets: RegisteredMarket[] = [];
//   let marketData: EconiaMarkets;

//   registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.MAINNET); //tested
//   marketData = await econia.markets(
//     registeredMarkets.filter((market) => market.marketId == 7)[0],
//     ENVIRONMENT.MAINNET
//   );

//   const buyOrderPayload = await marketData.placeLimitOrder(BUY, 0.5, 5);
//   await waitHelper(buyOrderPayload);
// };
// // placeLimitOrder();

// const placeMarketOrder = async () => {
//   const econia = new EconiaTrade(aptosClient);
//   let registeredMarkets: RegisteredMarket[] = [];
//   let marketData: EconiaMarkets;

//   registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.MAINNET); //tested
//   marketData = await econia.markets(
//     registeredMarkets.filter((market) => market.marketId == 7)[0],
//     ENVIRONMENT.MAINNET
//   );

//   const estimatedPrice = await marketData.getEstimatedPrice(1, BUY);
//   console.log(estimatedPrice);
//   const payload = await marketData.placeMarketOrder(BUY, 1);
//   await waitHelper(payload);
// };
// placeMarketOrder();
