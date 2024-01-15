import {Transaction, Keypair, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';


export default function Deposit(params) {
    
    const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey

    async function handleDeposit(e) {

        e.preventDefault()

        const kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWallet: WalletType.XBULL
        });

        const server = new SorobanRpc.Server(
            "https://soroban-testnet.stellar.org:443",
        )
        const contractAddress = contractId
        const contract = new Contract(contractAddress)
        const sourceAccount = await server.getAccount(publicKey)
        const args = [
            new Address(publicKey).toScVal(),
            quantity
        ]

        let builtTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call("deposit", ...args))
            // This transaction will be valid for the next 30 seconds
            .setTimeout(30)
            .build();

        let preparedTransaction = await server.prepareTransaction(builtTransaction).toXDR();
        const { signedXDR } = await kit.sign({
            xdr: preparedTransaction,
            publicKey,
        });

        console.log(
            `Signed prepared transaction XDR: ${signedXDR}`,
        );

        try {
            let sendResponse = await server.sendTransaction(signedXDR);
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
            console.log("Sending transaction failed");
            console.log(JSON.stringify(err));
        }}

    return (
        <form onSubmit={handleDeposit}>
            <label className="flex">
                <span>quantity</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}>
                </input>
            </label>
            <button>deposit</button>
        </form>
    )
}