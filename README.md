# Teal
Visualize trace files.

# Run Teal on your local computer

Download the source code using `git clone`:

`git clone https://github.com/gear-genomics/teal.git`

Or download as a .zip and unpack.

Open a terminal and `cd` into the Teal directory:

`cd teal`

## Setup and run the web app (server & client) using Docker Compose

Install [Docker Desktop](https://docs.docker.com/desktop/mac/install/). Docker Desktop for Mac includes Docker Compose, which will be used to stand up the server and client.

Start the services:

`docker-compose up -d`

(The first time you run this, it may take a few minutes to build the containers)

Connect to the client via http://localhost:1234

## Setup the web app manually

### Server

The server runs in a terminal

Install the dependencies:

`sudo apt install python python-pip`

`pip install flask flask_cors`

Start the server:

`cd PATH_TO_TEAL/teal`

`export PATH=$PATH:/PATH_TO_TRACY/tracy/bin`

`echo $PATH`

`python server/server.py`

### Client

The client requires a different terminal

Install the dependencies:

`cd PATH_TO_TEAL/teal/client`

`sudo apt install npm`

`sudo npm install`

Start the client:

`cd PATH_TO_TEAL/teal/client`

`npm run dev`


