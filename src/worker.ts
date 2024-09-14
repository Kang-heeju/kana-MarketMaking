// import { parentPort, workerData } from "worker_threads";
// import { MainClient } from "./client/main.client";
// import { BUY, SELL } from "@kanalabs/trade";
// import { AptosAccount } from "@kanalabs/trade/node_modules/aptos";

// const client = new MainClient(workerData.account as AptosAccount);

// let lastTradeTime = Date.now();
// let temp = 0;

// async function tradeProcess() {
//   setInterval(async () => {
//     let isOrderOpen = true;

//     try {
//       const marketPrice = await client.getMarketPrice();
//       const bid = marketPrice.bestBidPrice;
//       const ask = marketPrice.bestAskPrice;
//       const executionPrice = await client.getLastPrice();
//       const spread = Number(ask) - Number(bid);

//       const orderstatus = await client.orderHistory();

//       if (orderstatus == 1 || orderstatus == 99) {
//         isOrderOpen = false;
//       }

//       parentPort?.postMessage(
//         `Spread: ${spread}, Order Status: ${orderstatus}`
//       );

//       if (isOrderOpen && orderstatus == 0) {
//         if (spread <= 0.002001) {
//           console.log("주문 가능 상태: ", isOrderOpen);
//           if (Math.abs(Number(executionPrice) - Number(ask)) <= 0.01) {
//             const buyOrder = await client.placeLimitOrder(
//               BUY,
//               3,
//               Number(executionPrice)
//             );
//             if (buyOrder === 0) {
//               // 주문 성공
//               temp = executionPrice;
//               lastTradeTime = Date.now();
//               parentPort?.postMessage(`Buy Order Placed: ${executionPrice}`);
//             }
//           }
//         }
//         const marketPrice = await client.getMarketPrice(); //marketPrice refresh

//         if (isOrderOpen && Number(marketPrice.bestAskPrice) >= temp) {
//           const sellOrder = await client.placeLimitOrder(
//             SELL,
//             3,
//             Number(marketPrice.bestAskPrice) //execution price 맞는지?
//           );
//           if (sellOrder === 0) {
//             lastTradeTime = Date.now();
//             parentPort?.postMessage(
//               `Sell Order Placed: ${Number(marketPrice.bestAskPrice)}`
//             );
//           }
//         }
//       }

//       if (Date.now() - lastTradeTime >= 30 * 1000) {
//         parentPort?.postMessage("Canceling Orders due to timeout");
//         if ((await client.orderHistory()) == 2) {
//           client.cancleAllOrder(SELL);
//           // await client.placeLimitOrder(
//           //   SELL,
//           //   3,
//           //   Number(marketPrice.bestAskPrice)
//           // );
//           await client.placeMarketOrder(SELL, 3);
//         } else if ((await client.orderHistory()) == 3) {
//           client.cancleAllOrder(BUY);
//         }
//       }

//       if (Number(executionPrice) >= Number(marketPrice.bestAskPrice) + 0.01) {
//         parentPort?.postMessage("LOSS: Execution price is too high");
//       }
//     } catch (error) {
//       parentPort?.postMessage(`Error: ${(error as any).message}`);
//     }
//   }, 1000 * 10);
// }

// tradeProcess().catch((err) =>
//   parentPort?.postMessage(`Error in trade process: ${err}`)
// );
