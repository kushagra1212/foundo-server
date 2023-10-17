# Download the App
  ## [Download From Here](https://www.amazon.in/Kushagra-Rathore-Foundo-Lost-Found/dp/B0BTWKPSSG/ref=sr_1_3?crid=CG8M8E4FJZU3&keywords=lost+and+found&qid=1676153695&s=mobile-apps&sprefix=lost+and+foundo%2Cmobile-apps%2C228&sr=1-3_)

  
 # Foundo: Lost and Found (Backend)
## Screenshots

<div align="center">
  <img src="https://m.media-amazon.com/images/I/717yFkA6l1L._SL500_.jpg" width="200" alt="Screenshot 1">
  <img src="https://m.media-amazon.com/images/I/71HkVGMI0ML._SL500_.jpg" width="200" alt="Screenshot 2">
  <img src="https://m.media-amazon.com/images/I/71KQjYJOR6L._SL500_.jpg" width="200" alt="Screenshot 3">
  <img src="https://m.media-amazon.com/images/I/71lEPQldVXL._SL500_.jpg" width="200" alt="Screenshot 4">
  <img src="https://m.media-amazon.com/images/I/71fjiaN08kL._SL500_.jpg" width="200" alt="Screenshot 4">
  <img src="https://m.media-amazon.com/images/I/71RG+vyKFxL._SL500_.jpg" width="200" alt="Screenshot 5">
  <img src="https://m.media-amazon.com/images/I/61ijVuGUrwL._SL500_.jpg" width="200" alt="Screenshot 6">
  <img src="https://m.media-amazon.com/images/I/71HqQ959FYL._SL500_.jpg" width="200" alt="Screenshot 6">
</div>

## Demo Video  
Click the Youtube Icon to watch the demo video on YouTube:

[<img src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png" width="50">](https://www.youtube.com/watch?v=FFfxGZapPZE)



## Overview
-    A feature-packed Android application, featuring a visually pleasing and user-friendly UI, utilizing React-Native, integrated with AWS services such as RDS MySQL and S3 storage. 
-    This AI Powered app enabled users to easily report lost or found items by collecting pictures and necessary information, search and filter listings, connect and chat with other users, and access location-based features, login/authentication, password reset, privacy settings, and user profiles. 
- Utilized Jest for unit, integration, and API testing, and Detox for frontend end-to-end (E2E)  testing.
-    Backend built with Node.js, Express, MySQL, and WebSocket for real-time chat functionality.
-    Utilized Docker in conjunction with GitHub Actions(CI/CD)  for testing and deployment.

## Features
- Report lost or found items with pictures and necessary information.
- AI Powered Lost Item Matching.
- Search and filter listings easily.
- Connect with other users for item retrieval.
- Chat with other users to coordinate item retrieval.
- Location-based features for improved item tracking.
- Login/authentication and password reset functionalities.
- Customizable privacy settings and user profiles.
- Push notifications when Item is matched.
## Technologies Used
    Node.js
    Express
    MySQL
    AWS (RDS, S3)
    React Native
    RTK Query 
    JavaScript
    TypeScript
    JSON
  
# INSTALLATION

### Prerequisites
- [Git](https://git-scm.com/downloads)
- [npm](https://www.npmjs.com/get-npm)
- [MySQL](https://dev.mysql.com/downloads/installer/) (This is optional, you can use the dockerized version)
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [AWS Account](https://aws.amazon.com/)


### Steps
1. Clone the repository:
   ```shell
   git clone
    ```
2. Navigate to the project directory:
    ```shell
    cd foundo-server
    ```
3. Create the .env file:
    ```shell
    cp example-env.txt .env
    ```
4. Update the .env file with your credentials:
    ```shell
    nano .env
    ```
5. install dependencies:
    ```shell
    npm install
    ```
6. Start the server:
    ```shell
    docker-compose up --build
    ```
7. Open the application in your browser:
    ```shell
    http://localhost:PORT
    ```

# Testing

##  Tests

## Unit && Integration Tests
To run the integration tests, run the following command:
```shell
./run-tests.sh 
```

