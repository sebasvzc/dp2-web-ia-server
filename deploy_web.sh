#!/bin/bash

git restore --source=HEAD dp2-web-client

# Check if a parameter is provided
if [ -z "$1" ]; then
  echo "Debe introducir la direccion url base, por ejemplo: $0 http://3.218.68.113"
  exit 1
fi

# Assign the parameter to a variable
PARAMETER=$1

# Use the parameter
echo "The parameter provided is: $PARAMETER"

# Example of using the parameter in a command
cd dp2-web-client/src
find . -type f -exec sed -i "s|http://localhost:3000|$PARAMETER/api|g" {} +

sudo systemctl stop nginx
echo "Compilando la app web..."
sudo rm -r dist/*
yarn install
yarn build
echo "Desplegando archivos al servidor..."
sudo rm -r /var/www/html/*
sudo cp -r dist/* /var/www/html
sudo systemctl start nginx
sudo systemctl status nginx
echo "Listo!"