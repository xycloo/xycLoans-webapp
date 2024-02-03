"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
//import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { useRouter } from 'next/navigation'



export default async function WithdrawMatured(params) {

    //const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey.value
    const router = useRouter()

    async function handleWithdrawMatured(e) {

        //e.preventDefault()

        const kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWallet: WalletType.FREIGHTER
        });

        const server = new SorobanRpc.Server(
            "https://soroban-testnet.stellar.org:443",
        )
        const contractAddress = contractId
        const contract = new Contract(contractAddress)

        const sourceAccount = await server.getAccount(publicKey)

        /*
        const amount = xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString((Number(BigInt(quantity) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
            hi: xdr.Int64.fromString((Number((BigInt(quantity) >> BigInt(64)) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
        }));
        */

        let builtTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call("withdraw_matured", new Address(publicKey).toScVal()))
            // This transaction will be valid for the next 30 seconds
            .setTimeout(100)
            .build();

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
                    router.refresh()
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
    } return (
        <button onClick={handleWithdrawMatured} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Withdraw Rewards
            </span>
        </button>)
}