import { MainClient } from "./client/main.client";
import {
  account0,
  account1,
  account2,
  account3,
  account4,
  account5,
} from "./config";
import { marketMaking } from "./strategy";

async function main() {
  const client0 = new MainClient(account0);
  const client1 = new MainClient(account1);
  const client2 = new MainClient(account2);
  const client3 = new MainClient(account3);
  const client4 = new MainClient(account4);
  const client5 = new MainClient(account5);

  console.log("Start Market Making");
  const clients = [client2, client3];

  const runMarketMaking = async () => {
    console.log("Executing marketMaking\n");

    // 병렬로 처리
    const tasks = clients.map((client) => marketMaking(client));
    await Promise.all(tasks);

    let lastTradeTime = new Date().toLocaleString();
    console.log(
      `${lastTradeTime} Completed marketMaking tasks for this interval\n`
    );

    setTimeout(runMarketMaking, 10 * 1000);
  };

  // 첫 실행
  runMarketMaking();
}

main();
