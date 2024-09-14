// import { isMainThread, Worker } from "worker_threads";
// import { account0, account1, account2, account3 } from "./config";
// import { AptosAccount } from "@kanalabs/trade/node_modules/aptos";
// import path from "node:path";

// function createWorker(account: AptosAccount) {
//   return new Worker("./src/worker.js", {
//     workerData: {
//       account: account,
//     },
//   });
// }

// function runWorkers() {
//   const worker0 = createWorker(account0);
//   // const worker1 = createWorker(account1); // Commented out worker1
//   // const worker2 = createWorker(account2); // Commented out worker2
//   // const worker3 = createWorker(account3); // Commented out worker3

//   // 워커 메시지 처리
//   worker0.on("message", (msg) => console.log(`Worker0: ${msg}`));
//   // worker1.on("message", (msg) => console.log(`Worker1: ${msg}`)); // Commented out worker1
//   // worker2.on("message", (msg) => console.log(`Worker2: ${msg}`)); // Commented out worker2
//   // worker3.on("message", (msg) => console.log(`Worker3: ${msg}`)); // Commented out worker3

//   // 워커 에러 처리
//   worker0.on("error", (err) => console.error(`Worker0 Error: ${err}`));
//   // worker1.on("error", (err) => console.error(`Worker1 Error: ${err}`)); // Commented out worker1
//   // worker2.on("error", (err) => console.error(`Worker2 Error: ${err}`)); // Commented out worker2
//   // worker3.on("error", (err) => console.error(`Worker3 Error: ${err}`)); // Commented out worker3

//   // 워커 종료 시 처리
//   worker0.on("exit", (code) => {
//     if (code !== 0) console.log(`Worker0 exited with code ${code}`);
//   });
//   // worker1.on("exit", (code) => { // Commented out worker1
//   //   if (code !== 0) console.log(`Worker1 exited with code ${code}`);
//   // });
//   // worker2.on("exit", (code) => { // Commented out worker2
//   //   if (code !== 0) console.log(`Worker2 exited with code ${code}`);
//   // });
//   // worker3.on("exit", (code) => { // Commented out worker3
//   //   if (code !== 0) console.log(`Worker3 exited with code ${code}`);
//   // });
// }

// if (isMainThread) {
//   console.log("[Main Thread] Create Workers");
//   runWorkers();
// } else {
//   console.log("[Worker Thread] Start");
// }
