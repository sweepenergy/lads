import './App.css';
import Agent from './Agent.js';
import Add from './Add.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function getAgents(){
  return (
    <Row>
      <Col>
        <Agent id="Docker" />
      </Col>
      <Col>
        <Agent id="Cassandra" />
      </Col>
    </Row>
  );
}

function App() {
  <Container></Container>
  return (
  <BrowserRouter>

  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>Sweep</Navbar.Brand>
      <Nav>
        <Nav.Link href="/">Dashboard</Nav.Link>
        <Nav.Link href="/add">Add Directory</Nav.Link>
      </Nav> 
    </Container>
  </Navbar>
  <Container className="App-body">
    <Routes>
      <Route path="/" element={getAgents()} />
      <Route path="/add*" element={<Add />} />
    </Routes>

  </Container>
  </BrowserRouter>
  );
}

export default App;
