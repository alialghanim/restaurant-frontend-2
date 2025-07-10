#!/bin/bash

while true
do
  git add .
  git commit -m "تحديث تلقائي"
  git push
  sleep 300
done
