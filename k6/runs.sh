#!/usr/bin/env bash

cd -- "$(dirname -- "$0")" || exit 1

k6 run stress/cars.js
sleep 10s
k6 run stress/frontend-fleet.js
sleep 10s
k6 run spike/cars.js
sleep 10s
k6 run spike/frontend-fleet.js
sleep 10s
k6 run soak/cars.js
sleep 10s
k6 run soak/frontend-fleet.js