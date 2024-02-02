'use client'

import { Keypair, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc } from 'stellar-sdk'

export default function Interact() {
  const handleInteraction = async () => {

    // The source account will be used to sign and send the transaction.
    // GCWY3M4VRW4NXJRI7IVAU3CC7XOPN6PRBG6I5M7TAOQNKZXLT3KAH362
    const sourceKeypair = Keypair.fromSecret(
      "SAYWVLZVB4E6AC2Y3SVHU2T7R6ZYEHA23GHLWFPUGWVOLI4G3EVAPUAS",
    );

    // Configure SorobanClient to use the `soroban-rpc` instance of your
    // choosing.
    const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");

    // Here we will use a deployed instance of the `increment` example contract.
    const contractAddress =
      "CBAJ7HOTDDKAJIA6NSW6573SRX7P5X7NCM4UYCKCAPCPZLG6O52QHDEO";
    const contract = new Contract(contractAddress);

    // Transactions require a valid sequence number (which varies from one
    // account to another). We fetch this sequence number from the RPC server.
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());

    // The transaction begins as pretty standard. The source account, minimum
    // fee, and network passphrase are provided.
    let builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      // The invocation of the `increment` function of our contract is added
      // to the transaction. Note: `increment` doesn't require any parameters,
      // but many contract functions do. You would need to provide those here.
      .addOperation(contract.call("increment"))
      // This transaction will be valid for the next 30 seconds
      .setTimeout(30)
      .build();

      console.log(builtTransaction)

    // We use the RPC server to "prepare" the transaction. This simulating the
    // transaction, discovering the storage footprint, and updating the
    // transaction to include that footprint. If you know the footprint ahead of
    // time, you could manually use `addFootprint` and skip this step.
    let preparedTransaction = await server.prepareTransaction(builtTransaction);

    // Sign the transaction with the source account's keypair.
    preparedTransaction.sign(sourceKeypair);

    // Let's see the base64-encoded XDR of the transaction we just built.
    console.log(
      `Signed prepared transaction XDR: ${preparedTransaction
        .toEnvelope()
        .toXDR("base64")}`,
    );

    // Submit the transaction to the Soroban-RPC server. The RPC server will
    // then submit the transaction into the network for us. Then we will have to
    // wait, polling `getTransaction` until the transaction completes.
    try {
      let sendResponse = await server.sendTransaction(preparedTransaction.toXDR());
      console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

      if (sendResponse.status === "PENDING") {
        let getResponse = await server.getTransaction(sendResponse.hash);
        // Poll `getTransaction` until the status is not "NOT_FOUND"
        while (getResponse.status === "NOT_FOUND") {
          console.log("Waiting for transaction confirmation...");
          // See if the transaction is complete
          getResponse = await server.getTransaction(sendResponse.hash);
          // Wait one second
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);

        if (getResponse.status === "SUCCESS") {
          // Make sure the transaction's resultMetaXDR is not empty
          if (!getResponse.resultMetaXdr) {
            throw "Empty resultMetaXDR in getTransaction response";
          }
          // Find the return value from the contract and return it
          let transactionMeta = getResponse.resultMetaXdr;
          let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
          console.log(`Transaction result: ${returnValue.value()}`);
        } else {
          throw `Transaction failed: ${getResponse.resultXdr}`;
        }
      } else {
        throw sendResponse.errorResultXdr;
      }
    } catch (err) {
      // Catch and report any errors we've thrown
      console.log("Sending transaction failed");
      console.log(JSON.stringify(err));
    }
  }

  return (
    <div>
      <button onClick={handleInteraction}>interact</button>
    </div>
  );
}


/*
<nav className="border-gray-200 bg-white rounded-xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image
                        src={Logo} 
                        width="160"
                        height="100"
                        className="h-8" 
                        alt="xycloans Logo" 
                    />
                </a>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <li>
                            <a href="/" className="block py-2 px-3 md:p-0 text-gray-900 rounded md:bg-transparent md:text-[#0fd7a9]" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:text-[#0fd7a9]">Provide liquidity</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700">Borrow</a>
                        </li>
                        <li>
                            <a href="/pools" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:text-[#0fd7a9]" aria-current="page">Pools</a>
                        </li>

                        <button onClick={ConnectWallet}>Connect Wallet</button>
                    </ul>
                </div>
            </div>
        </nav>
*/