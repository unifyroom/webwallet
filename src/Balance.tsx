import React from 'react';
import { StatGroup, StatLabel, StatNumber, StatHelpText, StatArrow, Stat, Avatar, Stack, HStack, Box, Text, VStack, ButtonGroup, Button } from "@chakra-ui/react";

export default function Balance() {
  return (
    <HStack direction="row">
      <Box ml={10}>
        <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
      </Box>
      
      <Stat>
        <StatLabel>Balance</StatLabel>
        <HStack>
          <StatNumber>345,670</StatNumber><Text>UNFY</Text>
        </HStack>
        
        {/* <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText> */}
      </Stat>
      <ButtonGroup>
        <Button colorScheme='red'>Logout</Button>
      </ButtonGroup>
    </HStack>
  )
}