"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { useRouter } from 'next/navigation'



export default function Withdraw(params) {

    const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey.value;
    const router = useRouter()

    async function handleWithdraw(e) {

        e.preventDefault()

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

        const amount = xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString((Number(BigInt(quantity) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
            hi: xdr.Int64.fromString((Number((BigInt(quantity) >> BigInt(64)) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
        }));

        let builtTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call("withdraw", new Address(publicKey).toScVal(), amount))
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
    }
    return (
        <form className="bg-white pl-0 ml-0 py-0 mt-2 mb-4" onSubmit={handleWithdraw}>
            <label className="flex">
                <input
                    className="bg-gray-50 border p-auto border-gray-200 focus:outline-none focus:border-yellow-100 text-xs text-gray-900 text-sm rounded-l-lg transition duration-300 block w-full"
                    required
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}>
                </input>
                <button className="text-sm rounded-r-lg m-auto bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-80 transition duration-300 text-white">
                    <span className="text-xs">
                        Withdraw
                    </span>
                </button>
            </label>
        </form>
    )
}