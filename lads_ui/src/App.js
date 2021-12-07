import './App.css';

import Agent from './Agent.js';
import Add from './Add.js';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
//import 'backend/frontendConnection.js';



function getAgents(){
  return (
    <Container>
    <Row>
      <Col>
        <Agent id="Agent1" />
      </Col>
      <Col>
        <Agent id="Agent2" />
      </Col>
    </Row>
    <Row>
        <Col>
            <Agent id="Agent3" />
        </Col>
        <Col>
        <Agent id="Agent4" />
      </Col>
    </Row>
    </Container>
  );
}

function App() {
  return ( 
    <BrowserRouter>
  <Navbar variant="dark" className ="Navbar">
    <Container>
      <Navbar.Brand><h2>sweep.</h2></Navbar.Brand>
      <Nav>
        <Nav.Link href="/">Dashboard</Nav.Link>
        <Nav.Link href="/add">Add Directory</Nav.Link>
      </Nav> 
    </Container>
  </Navbar>
  <Container className="App-body">
    <Routes>
      <Route path="/" element={getAgents()} />
      <Route path="/add" element={<Add />} />
    </Routes>
  </Container>
  </BrowserRouter>
  );
}

export default App;
