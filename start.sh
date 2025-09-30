#!/bin/bash

# Start Django backend on port 3000 in the background
python manage.py runserver 0.0.0.0:3000 &

# Start frontend in the frontend directory
cd frontend
npm run dev -- --port 5000 --host 0.0.0.0