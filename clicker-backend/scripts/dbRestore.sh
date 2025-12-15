#!/bin/bash
# Restore MongoDB database from dump

set -e

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$MONGODB_URI" ]; then
  echo "Error: MONGODB_URI not set"
  exit 1
fi

# Find latest dump or use provided path
if [ -n "$1" ]; then
  DUMP_DIR="$1"
else
  DUMP_DIR=$(ls -td dumps/*/ 2>/dev/null | head -1)
fi

if [ -z "$DUMP_DIR" ] || [ ! -d "$DUMP_DIR" ]; then
  echo "Error: No dump found. Usage: $0 [dump_path]"
  echo "Available dumps:"
  ls -la dumps/ 2>/dev/null || echo "  No dumps directory"
  exit 1
fi

echo "Restoring from $DUMP_DIR..."
mongorestore --uri="$MONGODB_URI" --drop "$DUMP_DIR"

echo "Done! Database restored from $DUMP_DIR"
