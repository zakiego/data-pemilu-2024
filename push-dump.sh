#!/bin/bash

# Set the directory containing the files to commit
folder="dump"

# Get the current date and time for the commit message
commit_date=$(date +"%d %B %Y %H:%M")

# Counter for batch number
batch_number=1

# Initialize git repository if not already
git init

# Loop through the files in batches of 1000
for file in "$folder"/*; do
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
