#!/bin/bash

# Change directory to the "dump" folder
cd dump || exit

# Get the current date and time for the commit message
commit_date=$(date +"%d %B %Y %H:%M")

# Counter for batch number
batch_number=1

# Loop through the files in batches of 1000
for file in *; do
    if [[ -f $file ]]; then
        git add "$file"
        if (( batch_number % 1000 == 0 )); then
            # Commit every 1000 files
            commit_message="$commit_date - Batch $((batch_number / 1000))"
            git commit -m "$commit_message"
            git push origin HEAD:main
        fi
        ((batch_number++))
    fi
done

# Commit any remaining files
if (( (batch_number - 1) % 1000 != 0 )); then
    commit_message="$commit_date - Batch $((batch_number / 1000))"
    git commit -m "$commit_message"
    git push origin HEAD:main
fi
