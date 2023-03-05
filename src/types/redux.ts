import type { Dispatch as ReduxDispatch, Store as ReduxStore } from "redux";
import type { WalletMeta, Account } from "./wallet";

export type StoreStateType = {
    node: any;
    wallet: {
        walletNumber: number;
        accountNumber: number;
        salt: string;
        wallet: WalletMeta;
        accounts: Account[];
        transactions: [];
    };
};

export type Action = {
    type: string;
    payload?: Object | any;
};

export type GetState = () => StoreStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
