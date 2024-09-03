#!/usr/bin/bash
source .env

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
else
  migrate -path=migrations/ -database 'sqlite://'$DATABASE_PATH --verbose $1 $2
fi

