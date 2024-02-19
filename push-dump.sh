#!/bin/bash

# Step 1: Open `dump` folder
cd dump || { echo "Error: dump folder not found"; exit 1; }

# Step 2: Scan files number
file_count=$(ls -1 | wc -l)
echo "Total number of files: $file_count"

# Step 3: Chunk group to every 100 size
chunk_size=100
group_count=$(( ($file_count + $chunk_size - 1) / $chunk_size )) # Round up division
echo "Number of groups: $group_count"

# Step 4: Loop group, to git add "this all files every group", git commit, git push origin HEAD:main
for ((i = 0; i < $group_count; i++)); do
    start=$((i * chunk_size))
    end=$((start + chunk_size - 1))
    files=($(ls | sed -n "$((start + 1)),$((end + 1))p"))
    
    # Change directory to dump
    cd dump
    
    # Add files to git
    git add "${files[@]}"
    
    # Commit changes
    git commit -m "Added files from group $((i + 1))"
    
    # Push changes to origin
    git push origin HEAD:main
    
    # Move back to parent directory
    cd ..
done
