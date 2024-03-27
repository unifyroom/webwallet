import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Input, NumberInput, NumberInputField, Spacer, VStack, useDisclosure, Text, Divider, useToast } from "@chakra-ui/react";
import React from "react";
import { useMutation } from "react-query";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { tabIndexState } from "./state/TabState";
import { sendToAddress } from "./utils/explorer";
import { walletDataFilter } from "./state/WalletState";
import { decript } from "./ToolEncript";


interface SendData {
  toAddress: string
  amount: number
  txFee: number
}


const sendDataState = atom<SendData>({
  key: "sendDataState",
  default: {
    toAddress: "",
    amount: 0,
    txFee: 0.0001
    
  }
})



export default function Send(){

  const [sendData, setSendData] = useRecoilState(sendDataState)

  const changeAddr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendData(data => {
      return {
        ...data,
        toAddress: e.target.value
      }
    })
  }

  const setAmount = (valueAsString: string, valueAsNumber: number) => {
    setSendData(data => {
      return {
        ...data,
        amount: valueAsNumber
      }
    })
  }
  

  return (
  <VStack>
    <FormControl>
      <FormLabel>To Address</FormLabel>
      <Input type='address' onChange={changeAddr} value={sendData.toAddress}/>
      {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
    </FormControl>
    <FormControl>
      <FormLabel>Amount</FormLabel>
      <NumberInput defaultValue={10} clampValueOnBlur={false} value={sendData.amount} onChange={setAmount}>
        <NumberInputField />
      </NumberInput>
      {/* <FormHelperText>fee 0.0001 UNFY</FormHelperText> */}
    </FormControl>
    <FormControl>
      <Flex>
        <Spacer />
        <ButtonGroup>
          <SendPopup></SendPopup>
        </ButtonGroup>
      </Flex>
      
    </FormControl>
    
  </VStack>
  )
}


function SendPopup() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)
  const toast = useToast()
  const [sendData, setSendData] = useRecoilState(sendDataState)
  const [tabi, setTabi] = useRecoilState(tabIndexState)
  const wallet = useRecoilValue(walletDataFilter)


  const openPopup = () => {
    try {
      if(sendData.amount === 0){
        throw new Error("amount zero.")
      }

      if(sendData.toAddress === ""){
        throw new Error("address empty.")
      }


      onOpen()
    } catch (err) {
      if(err instanceof Error){
        toast({
          title: "Error",
          description: err.message,
          status: 'error'
        })
      } else {
        toast({
          title: "Error",
          description: "send unify error",
          status: 'error'
        })
      }
    }
    
    

    

  }

  const sendMutation = useMutation({
    mutationFn: async() => {
      
       await sendToAddress(async() => {
        if(!wallet.encSeed){
          throw new Error("wallet not login. (no seed)")
        }
  
        return decript(wallet.encSeed, "heri7777")


       }, wallet.address, sendData.toAddress, sendData.amount)
      
    },
    onSuccess: () => {
      onClose()
      setSendData({
        amount: 0,
        toAddress: '',
        txFee: 0
      })
      setTabi(1)
    },
    onError: (err) => {
      if(err instanceof Error){
        toast({
          title: "Error",
          description: err.message,
          status: 'error'
        })
      } else {
        toast({
          title: "Error",
          description: "send unify error",
          status: 'error'
        })
      }
    }
  })

  return (
    <>
      <Button colorScheme="blue" onClick={openPopup}>Send</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Send UNFY</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text><Text as='b'>{sendData.amount} UNFY</Text> to <Text as='b'>{sendData.toAddress}</Text> <br/> using available funds</Text>
            <Divider />
            <Text>Transaction Fee: <Text as='b'>{sendData.txFee} UNFY</Text> </Text>
            <Divider />
            <Text>Total Transaction: <Text as='b'>200.92 UNFY</Text></Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='blue' ml={3} onClick={() => sendMutation.mutate()}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      

    </>
  )
}

