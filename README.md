# buoy-demo

Demo application supporting the following functionality
    
    - List all buoy's within 100 miles of lat=40N and long=73W
    - Ability to favorite a buoy station
    - Ability to un-favorite a buoy station
    - Ability to toggle between full list and list of favorite's only
    
Install and run

    - Install Nodejs if needed: https://nodejs.org/en/
    - Pull project to local environment
    - cd to root directory of project
    - >npm install
    - >node main.js
    - Open http://localhost:8080/
    - To run unit tests cd to root directory and >npm test\

I added TODO's where there things were done more simplistically because its a demo, but here is the highlights

    - Replace lokijs in memory db with Mongo
    - Add logging/metrics/alarming on api's around latency, availability and unexpected/programmer errors.
    - Add more unit testing.
    - Add user management.
