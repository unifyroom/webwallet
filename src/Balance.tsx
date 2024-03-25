import React, { useEffect, useState } from 'react';
import { StatLabel, StatNumber, Stat, Avatar, HStack, Box, Text, ButtonGroup, Button, useDisclosure, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormErrorMessage, Menu, IconButton, MenuList, MenuItem, MenuButton } from "@chakra-ui/react";
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { useMutation } from 'react-query';
import { decript, encript, encriptPassword } from './ToolEncript';
import { walletDataFilter } from './state/WalletState';
import { Mnemonic } from '@unifyroom/unfycore-lib';
import { DeleteIcon, ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import Login from './Login';
import { getUtxoAddress } from './utils/explorer';

export interface WalletState {
  isLogin: boolean
}

const loginState = atom<WalletState>({
  key: "loginState",
  default: {
    isLogin: false
  }
})

function BalanceData(){
  const wallet = useRecoilValue(walletDataFilter)
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    const inter = setInterval(() => {

      wallet.address.map(addr => {
        getUtxoAddress(addr).then(data => {
          let balance = 0
          data.map(utxo => {
            balance += utxo.amount
          })
          setBalance(balance)
        })
      })

    }, 10000)

    return ()=> {
      clearInterval(inter)
    }

  }, [setBalance])

  return (
    <StatNumber>{balance}</StatNumber>
  )
}

export default function Balance() {
  const [wallet, setWallet] = useRecoilState(walletDataFilter)
  const isLogin = wallet.address.length > 0
  const isSeed = wallet.encSeed ? true: false
  
  const logout = () => {
    setWallet((data) => {
      return {
        ...data,
        address: []
      }
    })
  }

  return (
    <HStack direction="row">
      <Box mr={4} ml={8}>
        <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
      </Box>
      
      <Stat>
        <StatLabel>Balance</StatLabel>
        <HStack>
          <BalanceData /><Text>UNFY</Text>
        </HStack>
        
        {/* <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText> */}
      </Stat>
      {
        isSeed && 
        <ButtonGroup>
          {isLogin && <Button colorScheme='red' onClick={logout}>Logout</Button>}
          {!isLogin && <MenuCard />}
        </ButtonGroup>
      }

      {
        !isSeed && 
        <ButtonGroup>
          <Login />
        </ButtonGroup>
      }
      
    </HStack>
  )
}

export function MenuCard(){

  const [wallet, setWallet] = useRecoilState(walletDataFilter)
  const deleteWallet = () => {
    setWallet({
      address: [],
      encPassword: "",
      encSeed: ""
    })
  }
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
      />
      <MenuList>
        <OpenWallet></OpenWallet>
        <MenuItem icon={<DeleteIcon color="red" />} onClick={deleteWallet}>
          Delete Wallet
        </MenuItem>
      </MenuList>
    </Menu>

  )
}

function OpenWallet(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [password, setPassword] = useState<string>("")
  const [errstr, setErrstr] = useState<string>("")
  const [wallet, setWallet] = useRecoilState(walletDataFilter)

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const loginMutation = useMutation({
    mutationFn: async() => {
      if(password === ""){
        throw new Error("password empty")
      }
      if(!wallet.encSeed){
        throw new Error("seed not found")
      }
      
      // const encPassword = encriptPassword(password)
      const decrypted = decript(wallet.encSeed, password)
		  if (!decrypted) {
        throw new Error('Invalid wallet password')
      }

      const mnemonic = new Mnemonic(decrypted)
      const xpriv = mnemonic.toHDPrivateKey()
      const addresses = [
        xpriv
          .derive("m/44'/5'/0'/0/0", false)
          .privateKey.toAddress()
          .toString(),
      ]
      
      setWallet((data) => {
        return {
          ...data,
          address: addresses
        }
      })
      

    },
    onSuccess: () => {
      onClose()
      setErrstr("")
    },
    onError: (err) => {
      if(err instanceof Error){
        setErrstr(err.message)
      }
    }
  })
  
  return (
    <>
      <MenuItem icon={<ExternalLinkIcon />} onClick={onOpen}>
        Open Wallet
      </MenuItem>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Password.</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errstr !== ""}>
              <FormLabel>Type Password</FormLabel>
              <Input type="password" ref={initialRef} placeholder='password' onChange={e => setPassword(e.target.value)}/>
              <FormErrorMessage>{errstr}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>loginMutation.mutate()}>
              Login
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}