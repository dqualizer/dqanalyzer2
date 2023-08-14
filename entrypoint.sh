#!/bin/bash

# Check if the VITE_BACKEND_URL environment variable is set
if [ -z "$VITE_BACKEND_URL" ]; then
  echo "Error: 
       The environment variable VITE_BACKEND_URL is not set.
       Please enter a valid URL, for example, '-e VITE_BACKEND_URL=http://localhost:8080' on 'docker run'."
  exit 1
fi

# Run the env.sh script
source /usr/share/nginx/html/env.sh

# Start nginx
nginx -g "daemon off;" -c "/data/conf/"