import { hostExplorer } from "../variable";


export async function getTxAddress(address: string) {
  const uri = `${hostExplorer}/insight-api/txs/?address=${address}`
  const res = await fetch(uri, {
    mode: 'cors',
    cache: 'no-cache',
  })
  const data = await res.json()
  console.log(data)
  return data
}