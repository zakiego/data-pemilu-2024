#!/bin/bash
cd dump/

files_per_commit=10

modified_files=$(git status --porcelain | awk '{$1 = ""; print substr($0, 2)}')
total_modified_files=$(echo "$modified_files" | wc -l)
echo "Total modified files: $total_modified_files"

total_commits=$((total_modified_files / files_per_commit))
echo "Total commits will be made: $total_commits"

if [ $((total_modified_files % files_per_commit)) -ne 0 ]; then
    total_commits=$((total_commits + 1))
fi

for ((i = 0; i < total_commits; i++)); do
    start_index=$((i * files_per_commit))
    end_index=$((start_index + files_per_commit - 1))
    if [ $end_index -ge $total_modified_files ]; then
        end_index=$((total_modified_files - 1))
    fi
    commit_files=$(echo "$modified_files" | sed -n "$((start_index + 1)),$((end_index + 1))p")
    # make list commit files is one line
    commit_files=$(echo "$commit_files" | tr '\n' ' ')
    git add $commit_files
    git commit -m "Commit $((i + 1)) dari $total_commits"
done

git push origin HEAD:main