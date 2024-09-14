import { BUY, SELL,
    EconiaMarkets,
    EconiaTrade,
    ENVIRONMENT,
    eventId,
    RegisteredMarket,
    TakerEvents,
    TradeEventEmitter,
    tradeEventEmitter,
} from '@kanalabs/trade';
import BigNumber from 'bignumber.js';
import { AptosAccount, AptosClient } from '@kanalabs/trade/node_modules/aptos';
import { config } from 'dotenv';
import { WaitForTransactionError } from "aptos";
export const account1 = AptosAccount.fromAptosAccountObject({
    address: "0xdaf3a3c34d64c0dc7f4c126682675d9a201ecb29f152b412fc37bc78de9fc17d",
    privateKeyHex: "0x664b673c62fe9223a3ce5c64a2dbfa9397192db2347c3b309e3ae300a2ad103a",
  });

config({ path: '../../.env' });

async function waitHelper(
    payload: any,
    side: typeof BUY | typeof SELL,
    client: AptosClient
  ): Promise<number> {
    try {

      const IDBTransaction = await client.generateTransaction(
        account1.address(),
        payload
      );

      const sign = await client.signTransaction(
        account1,
        IDBTransaction
      );

      const onsubmit = await client.submitTransaction(sign);

      await client.waitForTransaction(onsubmit.hash, {
        checkSuccess: true,
        timeoutSecs: 20,
      });
    } catch (e) {
      const currentTime = new Date().toISOString();
      if (e instanceof WaitForTransactionError) {
        console.log(`[Uncertain] timeout at ${currentTime}`);
        return 0;
      } else {
        console.error(`[Error] at ${currentTime}`, e);
        // @ts-ignore
        if (e.message.includes("mempool")) {
          console.log(`[Mempool] at ${currentTime}`);
          return 2; // Mempool
        }

        return -1;
      }
    }
    const sideInfo = side === BUY ? "BUY" : "SELL";
    console.log(`[Success] ${sideInfo} at ${new Date().toISOString()}`);
    return 1;
  }
const main = async () => {
    try {
        const client = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');
        const econia = new EconiaTrade(client);
        
        const registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.MAINNET); //tested

        // const availableMarkets = await econia.getAvailableMarkets(registeredMarkets);
        // console.log(availableMarkets);

        let isOrderOpen = false;
        let temp = 0;
        let tradeCount = 0;
        let lossCount = 0;
        
        setInterval(async () => {
            const marketData = await econia.markets(registeredMarkets.filter((market) => market.marketId == 7)[0], ENVIRONMENT.MAINNET);
            const marketPrice = await marketData.getMarketPrice();

            //console.log(marketPrice);
            //console.log(marketPrice.bestAskPrice)
            //console.log(marketPrice.bestBidPrice)
            //console.log(marketPrice.getExecutionPrice(BigNumber(10000), false));
            //console.log(marketPrice.getExecutionPrice(BigNumber(10000), true));

            
            const bid = marketPrice.bestBidPrice;
            const ask = marketPrice.bestAskPrice;
            const spread = Number(ask) - Number(bid);
            
            let marketprice = marketPrice.getExecutionPrice(BigNumber(10000), false).executionPrice;
            const integer = marketprice.c ? marketprice.c[0] : 0;
            const decimal = marketprice.c ? marketprice.c[1] / Math.pow(10, String(marketprice.c[1]).length) : 0;
            const executionPrice = integer + decimal;

            console.log(integer);
            console.log(decimal);
            console.log(executionPrice);

            //console.log(spread);

            //const payload = await marketData.placeMarketOrder(BUY, 1);
            //await waitHelper(payload, BUY, client);

            /*
            if (spread >= 0.0019 && spread <= 0.002) {
                console.log(spread);
                if (!isOrderOpen) { // 현재 주문이 열려 있지 않은 경우에만 매수 시도
                    if (Math.abs(executionPrice - Number(ask)) <= 0.01) {
                        console.log(executionPrice);
                        console.log(Number(ask));
                        console.log("buyOrder");
                        temp = executionPrice;
                        marketData.placeLimitOrder(BUY, 3, ask.toNumber());
                        isOrderOpen = true; // 매수 주문이 실행되었음을 표시
                    }
                } else {
                    console.log("Waiting for sell order.");
                    console.log("매수 가격: " + temp);
                    console.log("현재 매도 가격: " + marketPrice.bestAskPrice.toNumber());
                }
            }
            if (isOrderOpen && executionPrice >= temp) {
                tradeCount++;
                console.log("sellOrder");
                console.log(executionPrice);
                console.log(temp);
                console.log("Trade count: " + tradeCount);
                console.log("Loss count: " + lossCount);
                marketData.placeMarketOrder(SELL, 3);
                isOrderOpen = false; // 매도 주문이 완료되면 다시 매수 가능하도록 상태 초기화
            }
            if (isOrderOpen && temp - 0.001 >= executionPrice) {
                lossCount++;
                //marketData.placeMarketOrder(SELL, 3);
                isOrderOpen = false; 
            }
            
         */
        }, 10000);



        // const marketData = await econia.markets(registeredMarkets.filter((market) => market.marketId == 7)[0], ENVIRONMENT.MAINNET);
        // const marketPrice = await marketData.getMarketPrice();
        // console.log(marketPrice);
        // const payload = await marketData.placeMarketOrder(BUY, 1);
        // await waitHelper(payload, BUY, client);


        // tradeEventEmitter.on(eventId.orderBook, (data) => {
        //     //console.log("orderbook data");
        //     console.log(data);
        // });

        
        // const orderBook = async () => {
        //     const myObject = new TradeEventEmitter(marketData);

        //     await myObject.triggerToOrderBook();

        //     //To unsubscribe events
        //     setTimeout(() => {
        //         myObject.terminateOrderBookEvent();
        //     }, 100000); 
        // };
        // await orderBook();
     
    } catch (error) {
        console.error('Error:', error);
    }

   
    // tradeEventEmitter.on(eventId.tradeHistory, (data) => {
    //     //console.log("tradeHistort data");
    //     console.log(data);
    // });


    // const tradeHistory = async () => {
    //     const econia = new EconiaTrade(client);
    //     let registeredMarkets: RegisteredMarket[] = [];
    //     let marketData: EconiaMarkets;

    //     registeredMarkets = await econia.fetchRegisteredMarkets(ENVIRONMENT.MAINNET); //tested
    //     marketData = await econia.markets(registeredMarkets.filter((market) => market.marketId == 7)[0]);
    //     // // Example usage
    //     const myObject = new TradeEventEmitter(marketData);

    //     await myObject.triggerTradeHistory();

    //     //To unsubscribe events
    //     setTimeout(() => {
    //         myObject.terminateOrderHistoryEvent();
    //     }, 100000); 
    // };
    // await tradeHistory();
};

main().catch(console.error);
