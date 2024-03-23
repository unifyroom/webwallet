import React from 'react';
import {  Button, ButtonGroup, Card, CardBody, CardHeader, Container, Heading } from '@chakra-ui/react';
import Login from './Login';
import Balance from './Balance';

function App() {
  return (
    <Container>
      <Card my={12}>
        <CardBody>
          <Balance />
        </CardBody>
      </Card>

      
      <Login />
    </Container>
  );
}

export default App;
