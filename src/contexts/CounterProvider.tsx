import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { MyProgram } from "idl/my_program";
import idlFile from "../idl/my_program.json";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CounterContextState {
  counterKeypair: Keypair;
  counterValue: number;
  program: Program<MyProgram> | null;
  setCounterValue: (value: number) => void;
}

export const CounterContext = createContext<CounterContextState>(
  {} as CounterContextState
);

export function useCounter(): CounterContextState {
  return useContext(CounterContext);
}

export const CounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const [counterValue, setCounterValue] = useState(-1);
  const counterKeypair = Keypair.generate();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<MyProgram> | null>(null);

  const idl = idlFile as Idl;

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      const programInstance = new Program(idl, idl.metadata.address, provider);
      setProgram(programInstance as unknown as Program<MyProgram>);
    }
  }, [wallet, connection, idl]);

  return (
    <CounterContext.Provider
      value={{ counterKeypair, counterValue, program, setCounterValue }}
    >
      {children}
    </CounterContext.Provider>
  );
};
