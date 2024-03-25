import { Mnemonic } from "@unifyroom/unfycore-lib"
import { atom, useRecoilValue } from "recoil"
import { getTxAddress, getUtxoAddress } from "../utils/explorer"


export interface WalletData {
  encPassword: string | null
  encSeed: string | null
  address: string[]
}
  
const localStorageEffect = (key: string) => ({setSelf, onSet}: any) => {
  const savedValue = localStorage.getItem(key)
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue))
  }
  onSet((newValue: any) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  })
}

export const walletDataFilter = atom<WalletData>({
  key: "walletDataFilter",
  default: {
    encPassword: "",
    encSeed: "",
    address: []
  },
  effects: [
    localStorageEffect("wallet")
  ]
})

export function getAddress(seed: string): string[]{
  const mnemonic = new Mnemonic(seed)
    const xpriv = mnemonic.toHDPrivateKey()
    const addresses = [
      xpriv
        .derive("m/44'/5'/0'/0/0", false)
        .privateKey.toAddress()
        .toString(),
    ]

  return addresses
}

export function useCreateRefreshTx() {
  const wallet = useRecoilValue(walletDataFilter)
  const calldata = async () => {
    if (wallet.address.length === 0) {
      console.log("address empty")
      return
    }
    
    const addresses = wallet.address
  
    for (var address of addresses) {
      await getTxAddress(address)
      await getUtxoAddress(address)
    }
  }
  
  return calldata
  
  

}