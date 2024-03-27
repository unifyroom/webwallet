import React from 'react';
import {  Card, CardBody, CardHeader, Container, Heading, Tabs, Tab, TabList, TabPanels, TabPanel, Box, Text } from '@chakra-ui/react';
import Balance from './Balance';
import { Transactions } from './Transactions';
import { useRecoilState, useRecoilValue } from 'recoil';
import { walletDataFilter } from './state/WalletState';
import Send from './Send';
import { tabIndexState } from './state/TabState';

function App() {
  const wallet = useRecoilValue(walletDataFilter)
  const [tabi, setTabi] = useRecoilState(tabIndexState)

  return (
    <Container>
      <Card my={6}>
        <CardBody>
          <Balance />
        </CardBody>
      </Card>

      <Card my={6}>
        <CardHeader>
          <Heading size='md'>Address</Heading>
          {
            wallet.address.map(addr => {
              return <Box key={addr}>
                <Text>
                  {addr}
                </Text>
              </Box>
            })
          }
        </CardHeader>
        <CardBody>
          
        </CardBody>
      </Card>

      <Card mb={12}>
        <CardBody>
          <Tabs index={tabi} onChange={setTabi}>
            <TabList>
              <Tab>Send</Tab>
              <Tab>Transactions</Tab>
              
            </TabList>

            <TabPanels>
              <TabPanel>
                <Send />
              </TabPanel>
              <TabPanel>
                <Transactions />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Container>
  );
}

export default App;
