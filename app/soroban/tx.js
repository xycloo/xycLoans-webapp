import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { Transaction, Keypair, xdr, TransactionBuilder, Networks, BASE_FEE, SorobanRpc } from 'stellar-sdk'


export const publishTx = async (publicKey, contract_call) => {
    const server = new SorobanRpc.Server(
        "https://soroban-testnet.stellar.org:443",
    )

    const sourceAccount = await server.getAccount(publicKey)

    let builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
    })
        .addOperation(contract_call)
        // This transaction will be valid for the next 30 seconds
        .setTimeout(100)
        .build();


    const kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWallet: WalletType.FREIGHTER
    });


    let preparedTransaction = await server.prepareTransaction(builtTransaction);
        console.log(preparedTransaction)

        const { signedXDR } = await kit.sign({
            xdr: preparedTransaction.toXDR(),
            publicKey,
        });

        console.log(
            `Signed prepared transaction XDR: ${signedXDR}`,
        );

        console.log("sending tx")
        let signed_tx = xdr.TransactionEnvelope.fromXDR(signedXDR, "base64");
        let newsig = Buffer.from(signed_tx._value._attributes.signatures[0]._attributes.signature).toString("base64");
        preparedTransaction.addSignature(publicKey, newsig);

        try {
            let sendResponse = await server.sendTransaction(preparedTransaction);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

            if (sendResponse.status === "PENDING") {
                let getResponse = await server.getTransaction(sendResponse.hash);
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    getResponse = await server.getTransaction(sendResponse.hash);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);

                if (getResponse.status === "SUCCESS") {
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = getResponse.returnValue;
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