import './App.css';
import Agent from './Agents.js';


function getAgents(){
  return (
    <div class="row">
      <div class="col">
        <Agent id="1001" />
      </div>
      <div class="col">
        <Agent id="1002" />
      </div>
    </div>
  );
}

function App() {
  return (
  <div className="App">
    <header className="App-header">
      <h2>sweep.</h2>
    </header>
    <body className="App-body">
        <div class="container-fluid">
          {getAgents()}
        </div>
    </body>
  </div>
  );
}

export default App;
