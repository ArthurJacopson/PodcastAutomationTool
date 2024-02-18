#!/bin/bash

# SAMPLE_FILE_DIRECTORY="$(pwd)/sample-files"
# echo "$SAMPLE_FILE_DIRECTORY"
# # No point in running tests if test files are not present
# if [ ! -d "$SAMPLE_FILE_DIRECTORY" ]; then
# 	echo "Test file directory does not exist!"
# 	exit 1
# fi

# if [ -z "$(ls -A $SAMPLE_FILE_DIRECTORY)" ]; then
# 	echo "Test file directory is empty!"
# 	exit 2
# fi
# # Assume all .py files in this directory are tests
# for f in *.py; do
# 	if python3 $f; then
# 		echo "Tests in $f passed successfully with an exit code of $?"
# 	else
# 		echo "Tests in $f failed with an exit code of $?"
# 		exit 3
# 	fi
# done

# exit 0
