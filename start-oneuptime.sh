#!/usr/bin/env bash

ONEUPTIME_HOME=/home/oneuptime

# make sure we are in correct directory
cd ${ONEUPTIME_HOME}

export $(grep -v '^#' config.env | xargs) && docker compose up --remove-orphans -d
