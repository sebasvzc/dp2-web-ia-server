#!/bin/bash
sudo systemctl stop nginx
echo "Building app..."
sudo rm -r dist/*
yarn install
yarn build
echo "Deploying files to Server..."
sudo rm -r /var/www/html/*
sudo cp -r dist/* /var/www/html
sudo systemctl start nginx
sudo systemctl status nginx
echo "Done!"
