#!/bin/bash

add_commit_push() {
    local message="$1"
    git add .
    git commit -m "$message"
    git push origin HEAD:main
}

main() {
    cd /dump/ || exit 1  # Change directory to /dump/ or exit if unsuccessful
    
    local total_files=$(git status --porcelain | wc -l)
    local chunk_size=10000
    local start_index=0
    
    # Generate timestamp for the first loop
    local timestamp=$(date +"%d %B %Y %H:%M")
    
    while [ $start_index -lt $total_files ]; do
        local end_index=$((start_index + chunk_size))
        if [ $end_index -gt $total_files ]; then
            end_index=$total_files
        fi
        
        local message="$timestamp - Batch $((start_index / chunk_size + 1))"
        
        git status --porcelain | head -n $end_index | tail -n $chunk_size | cut -c4- | xargs git add
        
        add_commit_push "$message"
        
        start_index=$end_index
    done
}

main
