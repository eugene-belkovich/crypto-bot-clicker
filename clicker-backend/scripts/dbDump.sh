#!/bin/bash
# Dump MongoDB database

set -e

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$MONGODB_URI" ]; then
  echo "Error: MONGODB_URI not set"
  exit 1
fi

DUMP_DIR="dumps/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DUMP_DIR"

echo "Dumping database to $DUMP_DIR..."
mongodump --uri="$MONGODB_URI" --out="$DUMP_DIR"

echo "Done! Dump saved to $DUMP_DIR"
