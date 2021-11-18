import './App.css';
import Agent from './Agent.js';


function getAgents(){
  return (
    <div className="row">
      <div className="col">
        <Agent id="Docker" />
      </div>
      <div className="col">
        <Agent id="Cassandra" />
      </div>
    </div>
  );
}

function App() {
  return (
  <div className="App">
    <div className="App-header">
      <h2>sweep.</h2>
    </div>
    <div className="App-body">
        <div className="container-fluid">
          {getAgents()}
        </div>
    </div>
  </div>
  );
}

export default App;
