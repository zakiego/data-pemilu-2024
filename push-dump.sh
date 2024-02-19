#!/bin/bash

# Step 1: Open dump folder
cd dump/

# Step 2: Get all modified files from git status
modified_files=$(git status --porcelain | grep '^ M' | cut -c4-)

# Step 3: Chunk with 10 files into array
chunk_size=10
file_count=$(echo "$modified_files" | wc -l)
group_count=$((file_count / chunk_size))

if [ $((file_count % chunk_size)) -ne 0 ]; then
    ((group_count++))
fi

group_index=0
for (( i=0; i<$file_count; i+=chunk_size )); do
    ((group_index++))
    start_index=$i
    end_index=$((start_index + chunk_size - 1))

    if [ $end_index -gt $((file_count - 1)) ]; then
        end_index=$((file_count - 1))
    fi

    files_in_group=$(echo "$modified_files" | sed -n "$((start_index + 1)),$((end_index + 1))p")

    # Step 4: Git add and commit push every group in each array
    git add $files_in_group
    git commit -m "Auto-commit: Group $group_index"
    git push origin HEAD:main
done
