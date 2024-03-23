import { Card, CardHeader, Heading, CardBody, Text, Button, useDisclosure, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, Code, FormErrorMessage, ButtonGroup } from '@chakra-ui/react';
import React, { useState } from 'react';
import { atom, selector, useRecoilState } from 'recoil';
import { Mnemonic } from '@unifyroom/unfycore-lib';
import { useMutation } from 'react-query';
import { encript, encriptPassword } from './ToolEncript';
import { getAddress, walletDataFilter } from './state/WalletState';




// const walletDataFilter = selector<WalletData>({
//   key: "walletDataFilter",
//   get: ({get}) => {
//     return {
//       encPassword: localStorage.getItem("encPassword"),
//       encSeed: localStorage.getItem("encSeed"),
//     }
//   },
//   set: ({}, val) => {
//     const value = val as WalletData
//     localStorage.setItem("encPassword", value.encPassword ? value.encPassword : "")
//     localStorage.setItem("encSeed", value.encSeed ? value.encSeed : "")
//   }
// })

function checkPassword(pwd: string, repwd: string): boolean{
  let isInvalidPass = false
  if(pwd !== ""){
    if(pwd !== repwd){
      isInvalidPass = true
    }
  }

  return isInvalidPass
}



// TODO: restore wallet

export default function Login(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  
  const [seed, setSeed] = useState<string>("")
  const [wallet, setWallet] = useRecoilState(walletDataFilter)
  const [password, setPassword] = useState<string>("")
  const [rePassword, setRePassword] = useState<string>("")
  

  const isInvalidPass = checkPassword(password, rePassword)
 
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const openModal = () => {
    const hdseed = new Mnemonic().toString()
    setSeed(hdseed)
    onOpen()
  }
  const createWallet = useMutation({
    mutationFn: async() => {
      if(password === "" || rePassword === ""){
        throw new Error("password Empty.")
      }
      if(checkPassword(password, rePassword)){
        throw new Error("Password not match")
      }
      
      const datawallet = {
        encSeed: encript(seed, password),
        encPassword: encriptPassword(password),
        address: getAddress(seed)
      }
      
      setWallet(datawallet)
      console.log(datawallet)
    },
    onSuccess: () => {
      onClose()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "create wallet error",
        status: 'error'
      })
    }
  })

  const deleteWallet = () => {
    setWallet({
      encPassword: "",
      encSeed: "",
      address: []
    })
  }

  return (
    <>
      <Button colorScheme='blue' onClick={openModal}>Create Wallet</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>HD Seed</FormLabel>
              <Code>{seed}</Code>
            </FormControl>
            <FormControl isInvalid={isInvalidPass}>
              <FormLabel>Password</FormLabel>
              <Input type='password' ref={initialRef} placeholder='Password' onChange={e => setPassword(e.target.value)}/>
              <FormErrorMessage>Password Not Match.</FormErrorMessage>
            </FormControl>
            

            <FormControl mt={4} isInvalid={isInvalidPass}>
              <FormLabel>Re-enter Password</FormLabel>
              <Input type='password' placeholder='Re-enter Password' onChange={e => setRePassword(e.target.value)}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => createWallet.mutate()}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    
  )
}