#!/bin/bash
# This file contains bash commands that will be executed at the end of the container build process,
# after all system packages and programming language specific package have been installed.
#
# Note: This file may be removed if you don't need to use it

#!/bin/bash
echo "Starting the application..."
python main.py &
echo "Waiting for application to start..."
sleep 5
echo "Opening browser..."
xdg-open http://localhost:5000