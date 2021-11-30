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

This data is analyzed and used by admin to create better solutions for their clients. SweepEnergy handles dozens of Docker Containers through multiple servers. However, collecting the log data for both Docker and their Cassandra Database is currently done manually. 

To solve this problem, our team is tasked with pulling logs data from Docker Containers and Cassandra Database on multiple servers, and preparing these logs files to be sent to SweepAPI.

Our project contains a UI that can be accessed by the admins, from which, the admin can specify which locations to pull logs from. Locations are categorized by agents.

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
2. Clone the frontend and backend repo into the same folder.
   ```sh
   git clone https://github.com/sweepenergy/lads/tree/1.0.0
   ```
   
   ```sh
   git clone https://github.com/sweepenergy/lads/tree/frontend
   ```
3. Install npm packages
   ```sh
   npm install
   ```
4. Enter your API token in `.env`
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


<p align="right">(<a href="#top">back to top</a>)</p>
