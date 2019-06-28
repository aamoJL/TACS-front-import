#!/bin/bash
# Entry script to start Xvfb and set display
set -e

# Set the defaults
DEFAULT_LOG_LEVEL="INFO" # Available levels: TRACE, DEBUG, INFO (default), WARN, NONE (no logging)
DEFAULT_RES="1280x1024x24"
DEFAULT_DISPLAY=":99"

# Use default if none specified as env var
LOG_LEVEL=${LOG_LEVEL:-$DEFAULT_LOG_LEVEL}
RES=${RES:-$DEFAULT_RES}
DISPLAY=${DISPLAY:-$DEFAULT_DISPLAY}

if [[ -z ${ROBOT_TESTS} ]];
  then
    echo "Error: Please specify the robot test or directory as env var ROBOT_TESTS"
    exit 1
fi

if [[ -z ${OUTPUT_DIR}  ]];
  then
    echo "Error: Please specify the output directory as env var OUTPUT_DIR"
    exit 1
fi

# Start Xvfb
echo -e "Starting Xvfb on display ${DISPLAY} with res ${RES}"
Xvfb ${DISPLAY} -ac -screen 0 ${RES} +extension RANDR &
export DISPLAY=${DISPLAY}

# Execute tests
echo -e "Executing robot tests at log level ${LOG_LEVEL}"

robot --loglevel ${LOG_LEVEL} --outputdir ${OUTPUT_DIR} ${ROBOT_TESTS}

# Stop Xvfb
kill -9 $(pgrep Xvfb)
