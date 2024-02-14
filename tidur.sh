#!/bin/bash

# Set maximum number of retries
max_retries=100
retries=0

while [ $retries -lt $max_retries ]; do
    bun run src/index.ts get-tps-detail  # Replace 'your_script.sh' with your actual script name
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo "Script ran successfully."
        break
    else
        echo "Script failed. Retrying..."
        retries=$((retries + 1))
        sleep 60  # Add a delay of 60 seconds between retry attempts
    fi
done

if [ $retries -eq $max_retries ]; then
    echo "Maximum number of retries reached. Exiting."
fi
