#!/bin/bash

echo "🔁 Auto Git Push Running..."

while true
do
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git add .
    git commit -m "📝 تحديث تلقائي - $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    echo "✅ Changes pushed at $(date)"
  else
    echo "⏳ No changes at $(date)"
  fi
  sleep 300
done
