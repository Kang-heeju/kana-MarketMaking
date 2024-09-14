import {
  BUY,
  SELL,
  EconiaTrade,
  RegisteredMarket,
  TradeEventEmitter,
  tradeEventEmitter,
  eventId,
  EconiaMarkets,
  ENVIRONMENT,
  TradeTable,
  MarketPrice,
} from "@kanalabs/trade";
import { AptosAccount, AptosClient } from "@kanalabs/trade/node_modules/aptos";
import { WaitForTransactionError } from "aptos";
import * as dotenv from "dotenv";
import BigNumber from "bignumber.js";

dotenv.config();

export class MainClient {
  private buyClient: AptosClient;
  private sellClient: AptosClient;
  private econia: EconiaTrade;
  private sellEconia: EconiaTrade;
  private registeredMarkets: RegisteredMarket[];
  private kanaAccount: AptosAccount;
  private isOrderOpen: number = 0;
  private buyCount = 0;
  private sellCount = 0;
  private firstOrder = 0;

  constructor(account: AptosAccount) {
    //this.client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
    this.sellClient = new AptosClient(
      "https://fullnode.mainnet.aptoslabs.com/v1"
      //https://1rpc.io/aptos
      //https://fullnode.mainnet.aptoslabs.com/v1
    );
    this.buyClient = new AptosClient(
      "https://fullnode.mainnet.aptoslabs.com/v1"
    );
    this.econia = new EconiaTrade(this.buyClient);
    this.sellEconia = new EconiaTrade(this.sellClient);
    this.registeredMarkets = [];
    if (account) {
      this.kanaAccount = account;
    } else {
      throw new Error("Account is not defined");
    }
  }

  private async getMarketData(marketId: number, env: ENVIRONMENT) {
    if (this.registeredMarkets.length === 0) {
      this.registeredMarkets = await this.econia.fetchRegisteredMarkets(env);
    }
    const market = this.registeredMarkets.find(
      (market) => market.marketId === marketId
    );
    if (!market) {
      throw new Error(`Market with ID ${marketId} not found`);
    }
    return await this.econia.markets(market, env);
  }

  // public async getMarketPrice(retreis = 5, delay = 2000): Promise<MarketPrice> {
  //   for(let i = 0; i< retreis; i++){
  //     try {
  //       const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
  //       const marketPrice = await marketData.marketPrice(true);
  //       console.log(`${this.kanaAccont}`+marketPrice);
  //       return marketPrice as MarketPrice;
  //     } catch (error: any) {
  //       if(error.statusCode == 429){
  //         console.log("429 Error");
  //         await new Promise((resolve) => setTimeout(resolve, delay));
  //       }else {
  //         console.error("getMarketPrice Error:", error);
  //         throw error;
  //       }
  //     }
  //   }
  //   console.error("getMarketPrice Error: Retries Exceeded");
  // }

  public async getMarketPrice(): Promise<MarketPrice> {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const marketPrice = await marketData.marketPrice(true);
      // console.log(marketPrice);
      return marketPrice as MarketPrice;
    } catch (error) {
      console.error("getMarketPrice Error:", error);
      throw error;
    }
  }

  public async cancleAllOrder(side: boolean) {
    try {
      // Cancel all orders for both BUY and SELL
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const cancelPayload = await marketData.cancelAllOrders(); // 주문 취소에 필요한 payload 생성

      await this.waitHelper(cancelPayload, side);
      return 0;
    } catch (error) {
      console.error("cancleAllOrder Error:", error);
    }
  }

  public async getLastPrice() {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const marketPrice = await marketData.getMarketPrice();
      const last = await marketPrice.getExecutionPrice(BigNumber(1000), true);

      const lastPrice = last.executionPrice;
      // console.log(lastPrice);
      const integer = lastPrice.c ? lastPrice.c[0] : 0;
      let decimal = 0;
      if (lastPrice.c && integer == 6) {
        decimal = lastPrice.c[1] / Math.pow(10, String(lastPrice.c[1]).length + 0);
      } else if (lastPrice.c && integer == 5) {
        decimal = lastPrice.c[1] / Math.pow(10, String(lastPrice.c[1]).length);
      }
      const executionPrice = integer + decimal;

      // console.log(lastPrice);
      // console.log(executionPrice);
      // console.log(marketData);
      // console.log(marketPrice);

      return executionPrice;
    } catch (error) {
      console.error("getLastPrice Error:", error);
      throw error;
    }
  }

  public async getAllTrades() {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const getAllTrades = (await marketData.getAllTrades(true, {
        offset: 10, //  starting point for data retrieval
        limit: 10, // maximum number of records to return from the query
        order: "desc",
      })) as TradeTable[];
      //console.log(getAllTrades);
    } catch (error) {
      console.error("getAllTrades Error:", error);
    }
  }

  public async getOrderbook() {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const getOrderBook = await marketData.getOrderBook();
      // console.log(getOrderBook);
    } catch (error) {
      console.error("getOrderbook Error:", error);
    }
  }

  //GET USER MARKET ACCOUNT INFO
  public async getUserAccountInfo() {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      console.log(this.kanaAccount.address().toString());

      const marketInfo = await marketData.getUserMarketAccount(
        this.kanaAccount.address().toString()
      );
      console.log(marketInfo);
    } catch (error) {
      console.error("getUserAccountInfo Error:", error);
    }
  }

  // side에는 BUY, SELL이 들어가며, amount에는 주문량이 들어갑니다.
  public async placeMarketOrder(side: boolean, amount: number) {
    try {
      //if(side == SELL){ this.isOrderOpen == 1; }
      //else if(side == BUY){ this.isOrderOpen == 2; }
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);

      const estimatedPrice = await marketData.getEstimatedPrice(1, side);
      // console.log("estimatedPrice", estimatedPrice);

      const payload = await marketData.placeMarketOrder(side, amount);
      // console.log(payload);
      await this.waitHelper(payload, side);
      return 0;
    } catch (error) {
      console.error("placeMarketOrder Error:", error);
      return 1;
    }
  }

  public async washTrade(side: boolean, amount: number, price: number) {
    try {
      console.log(`placeLimitOrder at ${side} // price: ${price}`);
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);

      const payload = await marketData.placeLimitOrder(side, amount, price);
      await this.waitHelper(payload, side);

      //const openOrders = await marketData.getOpenOrders(account.address().toString(), 'open', 7);
      return 0;
    } catch (error) {
      console.error("placeLimitOrder Error:", error);
      return 1;
    }
  }

  public async placeLimitOrder(side: boolean, amount: number, price: number) {
    try {
      const sside = side ? "SELL" : "BUY";
      console.log(`placeLimitOrder at ${sside} // price: ${price}`);
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);

      const payload = await marketData.placeLimitOrder(side, amount, price);
      await this.waitHelper(payload, side);

      return 0;
    } catch (error) {
      console.error("placeLimitOrder Error:", error);
      return 1;
    }
  }

  public async orderHistory() {
    try {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);
      const openOrders = await marketData.getOpenOrders(
        this.kanaAccount.address().toString(),
        "open"
      );
      // 2-> BUY 없음. 1-> SELL 없음. 0-> 둘다 없음
      if (openOrders.asks.length === 0 && openOrders.bids.length === 0) {
        return 0; // 둘다 없음
      } else if (openOrders.bids.length !== 0 && openOrders.asks.length !== 0) {
        return 99; // 둘다 있음
      } else if (openOrders.bids.length !== 0 && openOrders.asks.length === 0) {
        return 2; // BUY 있음
      } else if (openOrders.bids.length === 0 && openOrders.asks.length !== 0) {
        return 3; // SELL 있음
      } else {
        return 1; // 오류
      }
    } catch (error) {
      console.error("orderHistory Error:", error);
      throw error;
    }
  }

  public async subscribeOrderbook() {
    tradeEventEmitter.on(eventId.orderBook, (data) => {
      console.log(data.data);
    });

    const orderBook = async () => {
      const marketData = await this.getMarketData(7, ENVIRONMENT.MAINNET);

      // Example usage
      const myObject = new TradeEventEmitter(marketData);

      await myObject.triggerToOrderBook();

      //To unsubscribe events
      setTimeout(() => {
        myObject.terminateOrderBookEvent();
      }, 200000); // 멈추는 시간
    };
    orderBook();
  }

  async waitHelper(
    payload: any,
    side: typeof BUY | typeof SELL
  ): Promise<number> {
    try {
      const client = side === BUY ? this.buyClient : this.sellClient;

      const IDBTransaction = await client.generateTransaction(
        this.kanaAccount.address(),
        payload
      );

      const sign = await client.signTransaction(
        this.kanaAccount,
        IDBTransaction
      );

      const onsubmit = await client.submitTransaction(sign);

      await client.waitForTransaction(onsubmit.hash, {
        checkSuccess: true,
        timeoutSecs: 60,
      });
    } catch (e) {
      const currentTime = new Date().toISOString();
      if (e instanceof WaitForTransactionError) {
        console.log(`waitHelper ERROR [Uncertain] timeout at ${currentTime}`);
        return 0;
      } else {
        console.error(`waitHelper ERROR [Error] at ${currentTime}`, e);
        // @ts-ignore
        if (e.message.includes("mempool")) {
          console.log(`waitHelper ERROR [Mempool] at ${currentTime}`);
          return 2; // Mempool
        }
        return -1;
      }
    }
    const sideInfo = side === BUY ? "BUY" : "SELL";
    //if(side == BUY){this.isOrderOpen = 2;console.log(`isOrderOpen: ${this.isOrderOpen}`); this.buyCount++;}
    //else if(side == SELL){this.isOrderOpen = 1;console.log(`isOrderOpen: ${this.isOrderOpen}`);this.sellCount++;}
    //console.log(`buyCount : ${this.buyCount}, sellCount : ${this.sellCount}`);
    //if(this.buyCount == this.sellCount) this.isOrderOpen = 0;

    console.log(`✅[Success] ${sideInfo} at ${new Date().toISOString()}\n`);
    return 1;
  }
}
