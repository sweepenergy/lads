import './styles/App.css';

import Agent from './components/Agent.js';
import Add from './components/Add.js';
import NoMatch from './components/NoMatch.js';

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
        <Agent id="Alpha" />
      </Col>
      <Col>
        <Agent id="Bravo" />
      </Col>
    </Row>
    <Row>
        <Col>
            <Agent id="Charlie" />
        </Col>
        <Col>
        <Agent id="Delta" />
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
        <Nav.Link href="/manage">Manage</Nav.Link>
        <Nav.Link href="https://app.facility-ops.com/dashboard/directory" target="_blank">Facility Ops</Nav.Link>
      </Nav> 
    </Container>
  </Navbar>
  <Container className="App-body">
    <Routes>
      <Route path="/" element={getAgents()} />
      <Route path="/manage" element={<Add />} />
      <Route element={NoMatch()} />
    </Routes>
  </Container>
  </BrowserRouter>
  );
}
export default App;
