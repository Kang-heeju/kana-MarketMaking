// import { BUY, SELL } from "@kanalabs/trade";
// import { WaitForTransactionError } from "aptos";

// export async function waitHelper(
//   payload: any,
//   side: typeof BUY | typeof SELL
// ): Promise<number> {
//   try {
//     const client = side === BUY ? buyClient : sellClient;

//     const transaction = await client.generateTransaction(
//       this.kanaAccont.address(),
//       payload
//     );

//     const sign = await client.signTransaction(this.kanaAccont, transaction);

//     const submit = await client.submitTransaction(sign);

//     await client.waitForTransaction(submit.hash, {
//       checkSuccess: true,
//       timeoutSecs: 20,
//     });
//   } catch (e) {
//     const currentTime = new Date().toISOString();
//     if (e instanceof WaitForTransactionError) {
//       console.log(`[Uncertain] timeout at ${currentTime}`);
//       return 0;
//     } else {
//       console.log(`[Error] at ${currentTime}`, e);
//       // @ts-ignore
//       if (e.message.includes("mempool")) {
//         console.log(`[Mempool] at ${currentTime}`);
//         return 2; // Mempool
//       }

//       return -1;
//     }
//   }
//   const sideInfo = side === BUY ? "BUY" : "SELL";
//   console.log(`[Success] ${sideInfo} at ${new Date().toISOString()}`);
//   return 1;
// }
