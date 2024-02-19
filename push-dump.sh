#!/bin/bash

cd dump/

# Tentuin jumlah file per commit
files_per_commit=5

# Ambil list modified files
modified_files=$(git status --porcelain | grep '^ M' | cut -d ' ' -f 3)

# Hitung jumlah modified files
total_files=$(echo "$modified_files" | wc -l)

# Hitung jumlah commit yang dibutuhkan
total_commits=$((total_files / files_per_commit))
if [ $((total_files % files_per_commit)) -ne 0 ]; then
    total_commits=$((total_commits + 1))
fi

# Loop untuk commit dan push setiap 100 file
for ((i = 0; i < total_commits; i++)); do
    start_index=$((i * files_per_commit))
    end_index=$((start_index + files_per_commit - 1))
    if [ $end_index -ge $total_files ]; then
        end_index=$((total_files - 1))
    fi
    commit_files=$(echo "$modified_files" | sed -n "$((start_index + 1)),$((end_index + 1))p")
    git add $commit_files
    git commit -m "Commit $((i + 1)) dari $total_commits"
done

git push origin HEAD:main
