import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getTxAddress } from "./utils/explorer";
import { useRecoilValue } from "recoil";
import { walletDataFilter } from "./state/WalletState";
import { Tx } from "./models/transaction";



export function Transactions(){
  const wallet = useRecoilValue(walletDataFilter)
  const [ txs, setTxs ] = useState<Tx[]>([])
  
  useEffect(() => {
    const inter = setInterval(() => {
      wallet.address.map(addr => {
        getTxAddress(addr).then(res => {
          setTxs(res.txs)
        })
      })
    }, 10000)

    return () => {
      clearInterval(inter)
    }
  }, [setTxs])

  const getAmount = (tx: Tx): number => {
    let amount = 0

    const vins = tx.vin.filter(value => {
      return wallet.address.includes(value.addr)
    })

    vins.map(dat => {
      amount -= dat.value
    })

    const vouts = tx.vout.filter(value => {
      const dd = value.scriptPubKey.addresses.filter(addr => {
        return wallet.address.includes(addr)
      })
      return dd.length > 0
    })

    vouts.map(dat => {
      amount += Number(dat.value)
    })

    return amount
  }

  return (
<TableContainer>
  <Table size='sm'>
    <Thead>
      <Tr>
        <Th isNumeric>Confirm</Th>
        <Th>tx ID</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        txs.map(tx => {
          return (
            <Tr key={tx.txid}>
              <Td isNumeric>{tx.confirmations}</Td>
              <Td>
                <Button colorScheme="blue" size="sm" variant="link">
                  ..{tx.txid.slice(tx.txid.length - 13)}
                </Button>
                
              </Td>
              <Td isNumeric>{getAmount(tx)}</Td>
            </Tr>
          )
        })
      }
    </Tbody>
  </Table>
</TableContainer>
  )
}