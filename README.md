# Teal
Visualize trace files.

Dependencies
------------

Teal requires Tracy, please intall first:

`https://github.com/gear-genomics/tracy`


Install a local copy for testing
--------------------------------

`git clone https://github.com/gear-genomics/teal.git`

`cd teal`


## Setup and run the web app (server & client) using Docker Compose

Install [Docker Desktop](https://docs.docker.com/desktop/mac/install/). Docker Desktop for Mac includes Docker Compose, which will be used to stand up the server and client.

Start the services:

`docker-compose up -d`

(The first time you run this, it maky take a few minutes to build the containers)

Connect to the client via http://localhost:1234

Setup and run the server manually
------------------------

The server runs in a terminal

Install the dependencies:

`sudo apt install python python-pip`

`pip install flask flask_cors`

Start the server:

`cd PATH_TO_TEAL/teal`

`export PATH=$PATH:/PATH_TO_TRACY/tracy/bin`

`echo $PATH`

`python server/server.py`

Setup and run the client manually
------------------------

The client requires a different terminal

Install the dependencies:

`cd PATH_TO_TEAL/teal/client`

`sudo apt install npm`

`sudo npm install`

Start the client:

`cd PATH_TO_TEAL/teal/client`

`npm run dev`


