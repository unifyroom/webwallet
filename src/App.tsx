import React from 'react';
import {  Card, CardBody, CardHeader, Container, Heading, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import Balance from './Balance';
import { Transactions } from './Transactions';

function App() {
  return (
    <Container>
      <Card my={6}>
        <CardBody>
          <Balance />
        </CardBody>
      </Card>

      <Card my={6}>
        <CardHeader>
          <Heading size='md'>Receive Address</Heading>
        </CardHeader>
        <CardBody>
          
        </CardBody>
      </Card>

      <Card mb={12}>
        <CardBody>
          <Tabs>
            <TabList>

              <Tab>Send</Tab>
              <Tab>Transactions</Tab>
              
            </TabList>

            <TabPanels>
              <TabPanel>
                <p>one!</p>
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
