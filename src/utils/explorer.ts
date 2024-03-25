import { TransactionRes, Utxo } from "../models/transaction";
import { hostExplorer } from "../variable";


export async function getTxAddress(address: string): Promise<TransactionRes> {
  const uri = `${hostExplorer}/insight-api/txs/?address=${address}`
  const res = await fetch(uri, {
    mode: 'cors',
    cache: 'no-cache',
  })
  const data = await res.json()
  return data
}

export async function getUtxoAddress(address: string): Promise<Utxo[]> {
  const uri = `${hostExplorer}/insight-api/addr/${address}/utxo`
  const res = await fetch(uri, {
    mode: 'cors',
    cache: 'no-cache',
  })
  const data = await res.json()
  return data
}


export async function addressToUtxo(addresses: string[]) {
  const utxoslist = await Promise.all(addresses.map(addr => {
    return getUtxoAddress(addr)
  }))

  console.log(utxoslist)

}

export async function sendToAddress(addresses: string[], toAddr: string, amount: number) {
  await addressToUtxo(addresses)
}