#!/bin/sh
set -e

# Ensure the DB schema exists (idempotent), then start the server.
node scripts/init-db.mjs
exec node build/index.js