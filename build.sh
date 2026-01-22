#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Building Backend..."

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
cd backend
python manage.py migrate

# Collect Static Files
python manage.py collectstatic --noinput

echo "✅ Build Complete!"
