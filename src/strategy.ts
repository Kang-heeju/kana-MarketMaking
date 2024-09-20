import { BUY, SELL } from "@kanalabs/trade";
import { MainClient } from "./client/main.client";
import { MarketPrice } from "./interfaces";

let flag = false;
let lastTradeTime = Date.now();
let temp = 0;
let isOrderOpen = true;
let quantity = 7;

export async function marketMaking(client: MainClient) {
  const marketPrice = await client.getMarketPrice();

  const bid = marketPrice.bestBidPrice;
  const ask = marketPrice.bestAskPrice;
  let executionPrice = await client.getLastPrice();
  console.log(ask, bid, executionPrice);
  if (Math.abs(Number(bid) - executionPrice) > 0.15) {
    //소수점 리밸런싱
    console.log(`Rebalance execution Price: ${executionPrice}`);
    console.log(`Bid price: ${bid}`);
    let integerPart = Math.floor(executionPrice);
    let decimalPart = executionPrice - integerPart;
    let shiftedDecimal = decimalPart / 10;
    executionPrice = integerPart + shiftedDecimal;
    console.log(`Rebalanced execution Price: ${executionPrice}\n`);
  }
  const spread = Number(ask) - Number(bid);

  console.log(`spread: ${spread}`);
  const orderstatus = await client.orderHistory();

  if (orderstatus == 1 || orderstatus == 99) {
    console.log("주문 불가능 상태");
    isOrderOpen = false;
  }

  if (isOrderOpen && orderstatus == 0) {
    //openOrder 존재 x -> 모든 주문 체결 완료
    if (spread <= 0.003001) {
      console.log(`Execution Price: ${executionPrice}\n ask : ${ask}`);
      if (Math.abs(Number(executionPrice) - Number(ask)) <= 0.02) {
        console.log("APT 매수 가능");
        const buyOrder = await client.placeLimitOrder(
          BUY,
          quantity,
          Number(bid)
        );
        // const buyOrder = await client.placeMarketOrder(BUY, quantity);
        lastTradeTime = Date.now();
        temp = executionPrice;
      }
    }
    if (isOrderOpen && Number(marketPrice.bestAskPrice) >= temp) {
      console.log("APT 매도 가능");
      const sellOrder = await client.placeLimitOrder(
        SELL,
        quantity,
        Number(ask)
      );
      // const sellOrder = await client.placeMarketOrder(SELL, quantity);
      lastTradeTime = Date.now();
    }
  }

  if (Date.now() - lastTradeTime >= 60 * 1000) {
    console.log("시간 초과로 주문 취소");
    lastTradeTime = Date.now();
    if ((await client.orderHistory()) === 2) {
      client.cancleAllOrder(BUY);
      console.log("BUY 주문 취소 : " + marketPrice.bestAskPrice);
    } else if ((await client.orderHistory()) === 3) {
      console.log("SELL 주문 취소: " + marketPrice.bestBidPrice);
      client.cancleAllOrder(SELL);
    }
  }
}
