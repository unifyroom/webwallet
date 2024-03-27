import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, UseModalProps } from "@chakra-ui/react";


type AskPasswordProp = UseModalProps & {
  onPass: (password: string) => void
}

export default function AskPassword({ isOpen, onClose, onPass }: AskPasswordProp) {
  const [password, setPassword] = useState<string>("")

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ask Password.</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>

          

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type='password' placeholder='Password' onChange={e => setPassword(e.target.value)}/>
            <FormErrorMessage>Password Not Match.</FormErrorMessage>
          </FormControl>
          

          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onPass(password)}>
            Ok
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}