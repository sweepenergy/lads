# LADS
# Sweep Energy Server and Docker Log Monitoring

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
SweepEnergy develops IOT hardware/software technologies for the industry. One of their technologies, SweepAPI, is used to collect time-series metric data of their clients’ programs. 

This data is analyzed and used by admins to create better solutions for their clients. SweepEnergy currently handles dozens of Docker Containers through multiple servers, and collecting log data from these containers is crucial to ensuring that each container is fully functional. However, collecting the log data for both Docker and their Cassandra Database is currently done manually, which is extremely inefficient on a large scale. 

To solve this problem, our team is tasked with pulling logs data from Docker Containers and Cassandra Database on multiple servers, then and preparing these logs files to be sent to SweepAPI in a JSON format. This allows for the log data to be processed autonomously rather than manually, and presented in a more readable format.

Our project contains a UI that can be accessed by the admins. From this UI, the admin can see all of the agents and their currently associated location, as well as modify the agents. Each agent's location can be changed and locations can be added or removed.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

These are the major frameworks and libraries used for creating this project.

* [React.js](https://reactjs.org/)
* [Helmet](https://helmetjs.github.io/)
* [Express](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com)
* [Axios](https://github.com/axios/axios)
* [Node.js](https://nodejs.org/en/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is how to install npm to install the necessary dependencies.
* npm
  ```sh
  npm install npm@latest -g
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Create a FacilityOps account [here](https://app.facility-ops.com/login).
2. Clone the frontend
   ```sh
   git clone https://github.com/sweepenergy/lads/tree/1.0.0
   ```
   
3. Install npm packages for the frontend
   ```sh
   npm install
   ```
   
4. Clone the backend in the same folder
   ```sh
   git clone https://github.com/sweepenergy/lads/tree/frontend
   ```
   
5. Install npm packages for the backend
   ```sh
   npm install
   ```
   
6. Create and enter your API token in a file called `.env`
   ```js
   const SWEEP_API_TOKEN = 'ENTER YOUR API TOKEN';
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

(Placeholder for Demo Video)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/sweepenergy/lads](https://github.com/sweepenergy/lads)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Sweep](https://sweep-ai.com/)
* [Docker Tips](https://betterprogramming.pub/about-var-run-docker-sock-3bfd276e12fd)
* [Portainer](https://www.portainer.io/)
* [Portainer Documentation](https://docs.portainer.io/v/ce-2.9/api/examples)
* [Cassandra (NoSQL) Database](https://www.geeksforgeeks.org/cassandra-nosql-database/)
* ['Tail' Command](https://blog.robertelder.org/intro-to-tail-command/)
* [Read/Write JSON files with Node.js](https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824)
* [Executing Shell Commands with Node.js](https://stackabuse.com/executing-shell-commands-with-node-js/)
* [Where are Docker Logs Stored](https://sematext.com/blog/docker-logs-location/)
* [SweepAPI Documentation](https://docs.sweepapi.com/)

<p align="right">(<a href="#top">back to top</a>)</p>
