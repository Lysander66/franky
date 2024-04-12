#!/bin/bash

# Function to scan Go files in a directory recursively
scan_go_files() {
  directory=$1

  # Loop through each file or directory in the given directory
  for file in "$directory"/*; do
    if [[ -d "$file" ]]; then
      # If it's a directory, recursively call the function
      scan_go_files "$file"
    elif [[ -f "$file" && "$file" =~ \.go$ && ! "$file" =~ _test\.go$ ]]; then
      # If it's a non-test Go file, search for lines containing "fmt.Print"
      results=$(grep -n "fmt\.Print" "$file")

      # If there are matching lines, print the file name and line number
      if [[ -n "$results" ]]; then
        echo "File: $file"
        echo "$results"
        echo
      fi
    fi
  done
}

# Check if a directory is provided as an argument
if [[ -z "$1" ]]; then
  echo "Please provide a directory as an argument."
  exit 1
fi

# Call the function with the provided directory
scan_go_files "$1"