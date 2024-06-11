#!/bin/bash

if [ -z "$DQAPI_HOST" ]; then
  echo "Error:
    The environment variable DQAPI_HOST is not set.
    Please enter a valid URL, for example, '-e DQAPI_HOST=http://localhost:8080' on 'docker run'."
  exit 1
fi

if [ -z "$DQTRANSLATOR_HOST" ]; then
  echo "Error:
    The environment variable DQTRANSLATOR_HOST is not set.
    Please enter a valid URL, for example, '-e DQTRANSLATOR_HOST=http://localhost:8080' on 'docker run'."
  exit 1
fi

# Start nginx
nginx -g "daemon off;"