#!/bin/bash

mongoimport -h localhost:27017 -d project2 -c events --drop --jsonArray ./db/events.json
mongoimport -h localhost:27017 -d project2 -c addresses --drop --jsonArray ./db/addresses.json