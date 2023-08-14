import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import { useCounter } from "contexts/CounterProvider";

export const AddEvenToCounter: FC = () => {
  const { program, counterKeypair, setCounterValue } = useCounter();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const onClick = useCallback(async () => {
    if (!wallet.publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature = "";
    try {
      const txid = await program.methods
        .addEven(new BN(42))
        .accounts({
          myCounter: counterKeypair.publicKey,
        })
        .rpc();

      const myCounter = await program.account.myCounter.fetch(
        counterKeypair.publicKey
      );
      console.log(myCounter);

      setCounterValue(
        myCounter && myCounter.value ? Number(myCounter.value) : -1
      );

      console.log(signature);
      notify({
        type: "success",
        message: "Add even transaction successful!",
        txid,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [wallet, notify, connection]);

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>
        <button
          className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={onClick}
          disabled={!wallet.publicKey}
        >
          <div className="hidden group-disabled:block ">
            Wallet not connected
          </div>
          <span className="block group-disabled:hidden">Add 42</span>
        </button>
      </div>
    </div>
  );
};
