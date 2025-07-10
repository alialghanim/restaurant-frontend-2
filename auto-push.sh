#!/bin/bash

while true
do
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git add .
    git commit -m "تحديث تلقائي"
    git push
  fi
  sleep 300
done
