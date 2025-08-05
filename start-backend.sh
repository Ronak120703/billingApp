#!/bin/bash

echo "Starting Billing App Backend..."
echo

cd server

echo "Installing dependencies..."
npm install

echo
echo "Testing MongoDB connection..."
npm run setup

echo
echo "Starting server..."
npm run dev 