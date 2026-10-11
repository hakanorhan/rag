# Load / Average
```
         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/cars.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=16.28ms
    ✓ 'p(99)<1000' p(99)=25.58ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 35744   85.087912/s
    checks_succeeded...: 100.00% 35744 out of 35744
    checks_failed......: 0.00%   0 out of 35744

    ✓ GET /cars: status ok

    HTTP
    http_req_duration..............: avg=8.71ms min=1.02ms med=7.99ms max=338.46ms p(90)=13.9ms p(95)=16.28ms
      { expected_response:true }...: avg=8.71ms min=1.02ms med=7.99ms max=338.46ms p(90)=13.9ms p(95)=16.28ms
    http_req_failed................: 0.00%  0 out of 35744
    http_reqs......................: 35744  85.087912/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s     med=1s     max=1.33s    p(90)=1.01s  p(95)=1.01s  
    iterations.....................: 35744  85.087912/s
    vus............................: 2      min=2          max=100
    vus_max........................: 100    min=100        max=100

    NETWORK
    data_received..................: 121 MB 289 kB/s
    data_sent......................: 2.7 MB 6.4 kB/s




running (7m00.1s), 000/100 VUs, 35744 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/search.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=21.04ms
    ✓ 'p(99)<1000' p(99)=38.81ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 35691   84.954929/s
    checks_succeeded...: 100.00% 35691 out of 35691
    checks_failed......: 0.00%   0 out of 35691

    ✓ GET /cars/search: status ok

    HTTP
    http_req_duration..............: avg=10.28ms min=1.41ms med=8.79ms max=135.8ms p(90)=17.42ms p(95)=21.04ms
      { expected_response:true }...: avg=10.28ms min=1.41ms med=8.79ms max=135.8ms p(90)=17.42ms p(95)=21.04ms
    http_req_failed................: 0.00%  0 out of 35691
    http_reqs......................: 35691  84.954929/s

    EXECUTION
    iteration_duration.............: avg=1.01s   min=1s     med=1s     max=1.13s   p(90)=1.01s   p(95)=1.02s  
    iterations.....................: 35691  84.954929/s
    vus............................: 2      min=2          max=100
    vus_max........................: 100    min=100        max=100

    NETWORK
    data_received..................: 49 MB  116 kB/s
    data_sent......................: 6.1 MB 14 kB/s




running (7m00.1s), 000/100 VUs, 35691 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/locations.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=14.34ms
    ✓ 'p(99)<1000' p(99)=18.5ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 35738   85.042633/s
    checks_succeeded...: 100.00% 35738 out of 35738
    checks_failed......: 0.00%   0 out of 35738

    ✓ locations: status 200

    HTTP
    http_req_duration..............: avg=8.83ms min=904µs med=8.92ms max=86.2ms p(90)=12.94ms p(95)=14.34ms
      { expected_response:true }...: avg=8.83ms min=904µs med=8.92ms max=86.2ms p(90)=12.94ms p(95)=14.34ms
    http_req_failed................: 0.00%  0 out of 35738
    http_reqs......................: 35738  85.042633/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s    med=1s     max=1.08s  p(90)=1.01s   p(95)=1.01s  
    iterations.....................: 35738  85.042633/s
    vus............................: 2      min=2          max=100
    vus_max........................: 100    min=100        max=100

    NETWORK
    data_received..................: 15 MB  36 kB/s
    data_sent......................: 2.9 MB 6.8 kB/s




running (7m00.2s), 000/100 VUs, 35738 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/frontend-fleet.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=60.18ms
    ✓ 'p(99)<1000' p(99)=102.78ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 35320   83.991317/s
    checks_succeeded...: 100.00% 35320 out of 35320
    checks_failed......: 0.00%   0 out of 35320

    ✓ /de/fuhrpark: status ok

    HTTP
    http_req_duration..............: avg=21.09ms min=4.56ms med=13ms  max=309.79ms p(90)=45.05ms p(95)=60.18ms
      { expected_response:true }...: avg=21.09ms min=4.56ms med=13ms  max=309.79ms p(90)=45.05ms p(95)=60.18ms
    http_req_failed................: 0.00%  0 out of 35320
    http_reqs......................: 35320  83.991317/s

    EXECUTION
    iteration_duration.............: avg=1.02s   min=1s     med=1.01s max=1.31s    p(90)=1.04s   p(95)=1.06s  
    iterations.....................: 35320  83.991317/s
    vus............................: 1      min=1          max=100
    vus_max........................: 100    min=100        max=100

    NETWORK
    data_received..................: 9.3 GB 22 MB/s
    data_sent......................: 60 MB  142 kB/s




running (7m00.5s), 000/100 VUs, 35320 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/frontend-home.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=63.8ms
    ✓ 'p(99)<1000' p(99)=102.32ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 35312   83.873192/s
    checks_succeeded...: 100.00% 35312 out of 35312
    checks_failed......: 0.00%   0 out of 35312

    ✓ home page: status 200

    HTTP
    http_req_duration..............: avg=21.4ms min=5.03ms med=13.3ms max=185.38ms p(90)=46.41ms p(95)=63.8ms
      { expected_response:true }...: avg=21.4ms min=5.03ms med=13.3ms max=185.38ms p(90)=46.41ms p(95)=63.8ms
    http_req_failed................: 0.00% 0 out of 35312
    http_reqs......................: 35312 83.873192/s

    EXECUTION
    iteration_duration.............: avg=1.02s  min=1s     med=1.01s  max=1.18s    p(90)=1.04s   p(95)=1.06s 
    iterations.....................: 35312 83.873192/s
    vus............................: 1     min=1          max=100
    vus_max........................: 100   min=100        max=100

    NETWORK
    data_received..................: 12 GB 27 MB/s
    data_sent......................: 73 MB 174 kB/s




running (7m01.0s), 000/100 VUs, 35312 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/frontend-search.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✗ 'p(95)<500' p(95)=522.89ms
    ✓ 'p(99)<1000' p(99)=682.25ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 30365   72.284762/s
    checks_succeeded...: 100.00% 30365 out of 30365
    checks_failed......: 0.00%   0 out of 30365

    ✓ search page: status 200

    HTTP
    http_req_duration..............: avg=187.74ms min=14.79ms med=129.48ms max=1.02s p(90)=437.44ms p(95)=522.89ms
      { expected_response:true }...: avg=187.74ms min=14.79ms med=129.48ms max=1.02s p(90)=437.44ms p(95)=522.89ms
    http_req_failed................: 0.00%  0 out of 30365
    http_reqs......................: 30365  72.284762/s

    EXECUTION
    iteration_duration.............: avg=1.18s    min=1.01s   med=1.13s    max=2.02s p(90)=1.43s    p(95)=1.52s   
    iterations.....................: 30365  72.284762/s
    vus............................: 2      min=2          max=100
    vus_max........................: 100    min=100        max=100

    NETWORK
    data_received..................: 8.7 GB 21 MB/s
    data_sent......................: 55 MB  131 kB/s




running (7m00.1s), 000/100 VUs, 30365 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s
ERRO[0420] thresholds on metrics 'http_req_duration' have been crossed 

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: load/reserve-car.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 7m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 7m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=63.43ms
    ✓ 'p(99)<1000' p(99)=109.96ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

    reservation_conflict_rate
    ✓ 'rate<0.20' rate=0.00%

    reservation_creation_rate
    ✓ 'rate>0.80' rate=100.00%


  █ TOTAL RESULTS 

    checks_total.......: 35345   83.939143/s
    checks_succeeded...: 100.00% 35345 out of 35345
    checks_failed......: 0.00%   0 out of 35345

    ✓ POST /reservations: status ok

    CUSTOM
    reservation_conflict_rate......: 0.00%   0 out of 35345
    reservation_creation_rate......: 100.00% 35345 out of 35345

    HTTP
    http_req_duration..............: avg=20.1ms min=2.55ms med=12.6ms max=2.16s p(90)=42.11ms p(95)=63.43ms
      { expected_response:true }...: avg=20.1ms min=2.55ms med=12.6ms max=2.16s p(90)=42.11ms p(95)=63.43ms
    http_req_failed................: 0.00%   0 out of 35347
    http_reqs......................: 35347   83.943893/s

    EXECUTION
    iteration_duration.............: avg=1.02s  min=1s     med=1.01s  max=3.17s p(90)=1.04s   p(95)=1.06s  
    iterations.....................: 35345   83.939143/s
    vus............................: 1       min=1              max=100
    vus_max........................: 100     min=100            max=100

    NETWORK
    data_received..................: 12 MB   27 kB/s
    data_sent......................: 64 MB   151 kB/s




running (7m01.1s), 000/100 VUs, 35345 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  7m0s
```

```
         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: stress/cars.js
        output: -

     scenarios: (100.00%) 1 scenario, 200 max VUs, 10m30s max duration (incl. graceful stop):
              * default: Up to 200 looping VUs for 10m0s over 5 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=15.29ms
    ✓ 'p(99)<1000' p(99)=22.66ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 77275   128.699652/s
    checks_succeeded...: 100.00% 77275 out of 77275
    checks_failed......: 0.00%   0 out of 77275

    ✓ GET /cars: status ok

    HTTP
    http_req_duration..............: avg=8.15ms min=939µs med=7.54ms max=75.15ms p(90)=12.99ms p(95)=15.29ms
      { expected_response:true }...: avg=8.15ms min=939µs med=7.54ms max=75.15ms p(90)=12.99ms p(95)=15.29ms
    http_req_failed................: 0.00%  0 out of 77275
    http_reqs......................: 77275  128.699652/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s    med=1s     max=1.07s   p(90)=1.01s   p(95)=1.01s  
    iterations.....................: 77275  128.699652/s
    vus............................: 2      min=1          max=200
    vus_max........................: 200    min=200        max=200

    NETWORK
    data_received..................: 262 MB 437 kB/s
    data_sent......................: 5.8 MB 9.7 kB/s




running (10m00.4s), 000/200 VUs, 77275 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  10m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: stress/frontend-fleet.js
        output: -

     scenarios: (100.00%) 1 scenario, 200 max VUs, 10m30s max duration (incl. graceful stop):
              * default: Up to 200 looping VUs for 10m0s over 5 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=57.15ms
    ✓ 'p(99)<1000' p(99)=104.47ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 76530   127.416141/s
    checks_succeeded...: 100.00% 76530 out of 76530
    checks_failed......: 0.00%   0 out of 76530

    ✓ GET /de/fuhrpark: status ok

    HTTP
    http_req_duration..............: avg=18.11ms min=4.37ms med=10.72ms max=336.22ms p(90)=37.78ms p(95)=57.15ms
      { expected_response:true }...: avg=18.11ms min=4.37ms med=10.72ms max=336.22ms p(90)=37.78ms p(95)=57.15ms
    http_req_failed................: 0.00%  0 out of 76530
    http_reqs......................: 76530  127.416141/s

    EXECUTION
    iteration_duration.............: avg=1.01s   min=1s     med=1.01s   max=1.33s    p(90)=1.03s   p(95)=1.05s  
    iterations.....................: 76530  127.416141/s
    vus............................: 2      min=1          max=200
    vus_max........................: 200    min=200        max=200

    NETWORK
    data_received..................: 20 GB  34 MB/s
    data_sent......................: 129 MB 215 kB/s




running (10m00.6s), 000/200 VUs, 76530 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  10m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: spike/cars.js
        output: -

     scenarios: (100.00%) 1 scenario, 200 max VUs, 3m1s max duration (incl. graceful stop):
              * default: Up to 200 looping VUs for 2m31s over 5 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=13.06ms
    ✓ 'p(99)<1000' p(99)=19.56ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 15571   102.903744/s
    checks_succeeded...: 100.00% 15571 out of 15571
    checks_failed......: 0.00%   0 out of 15571

    ✓ GET /cars: status ok

    HTTP
    http_req_duration..............: avg=6.36ms min=1.05ms med=5.57ms max=52.97ms p(90)=11.07ms p(95)=13.06ms
      { expected_response:true }...: avg=6.36ms min=1.05ms med=5.57ms max=52.97ms p(90)=11.07ms p(95)=13.06ms
    http_req_failed................: 0.00%  0 out of 15571
    http_reqs......................: 15571  102.903744/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s     med=1s     max=1.05s   p(90)=1.01s   p(95)=1.01s  
    iterations.....................: 15571  102.903744/s
    vus............................: 1      min=1          max=200
    vus_max........................: 200    min=200        max=200

    NETWORK
    data_received..................: 53 MB  350 kB/s
    data_sent......................: 1.2 MB 7.7 kB/s




running (2m31.3s), 000/200 VUs, 15571 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  2m31s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: spike/frontend-fleet.js
        output: -

     scenarios: (100.00%) 1 scenario, 200 max VUs, 3m1s max duration (incl. graceful stop):
              * default: Up to 200 looping VUs for 2m31s over 5 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=22.33ms
    ✓ 'p(99)<1000' p(99)=45.08ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 15516   102.487569/s
    checks_succeeded...: 100.00% 15516 out of 15516
    checks_failed......: 0.00%   0 out of 15516

    ✓ GET /de/fuhrpark: status ok

    HTTP
    http_req_duration..............: avg=10.43ms min=4.19ms med=8.17ms max=149.49ms p(90)=17.36ms p(95)=22.33ms
      { expected_response:true }...: avg=10.43ms min=4.19ms med=8.17ms max=149.49ms p(90)=17.36ms p(95)=22.33ms
    http_req_failed................: 0.00%  0 out of 15516
    http_reqs......................: 15516  102.487569/s

    EXECUTION
    iteration_duration.............: avg=1.01s   min=1s     med=1s     max=1.15s    p(90)=1.01s   p(95)=1.02s  
    iterations.....................: 15516  102.487569/s
    vus............................: 1      min=1          max=200
    vus_max........................: 200    min=200        max=200

    NETWORK
    data_received..................: 4.1 GB 27 MB/s
    data_sent......................: 26 MB  174 kB/s




running (2m31.4s), 000/200 VUs, 15516 complete and 0 interrupted iterations
default ✓ [======================================] 000/200 VUs  2m31s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: soak/cars.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 2h3m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 2h3m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=25.78ms
    ✓ 'p(99)<1000' p(99)=54.03ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 720723  97.655557/s
    checks_succeeded...: 100.00% 720723 out of 720723
    checks_failed......: 0.00%   0 out of 720723

    ✓ GET /cars: status ok

    HTTP
    http_req_duration..............: avg=11.03ms min=842µs med=8.94ms max=356.08ms p(90)=19.33ms p(95)=25.78ms
      { expected_response:true }...: avg=11.03ms min=842µs med=8.94ms max=356.08ms p(90)=19.33ms p(95)=25.78ms
    http_req_failed................: 0.00%  0 out of 720723
    http_reqs......................: 720723 97.655557/s

    EXECUTION
    iteration_duration.............: avg=1.01s   min=1s    med=1s     max=1.35s    p(90)=1.01s   p(95)=1.02s  
    iterations.....................: 720723 97.655557/s
    vus............................: 2      min=1           max=100
    vus_max........................: 100    min=100         max=100

    NETWORK
    data_received..................: 2.4 GB 332 kB/s
    data_sent......................: 54 MB  7.3 kB/s




running (2h03m00.3s), 000/100 VUs, 720723 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  2h3m0s

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: soak/frontend-fleet.js
        output: -

     scenarios: (100.00%) 1 scenario, 100 max VUs, 2h3m30s max duration (incl. graceful stop):
              * default: Up to 100 looping VUs for 2h3m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<500' p(95)=73.23ms
    ✓ 'p(99)<1000' p(99)=140.65ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 712130  96.483238/s
    checks_succeeded...: 100.00% 712130 out of 712130
    checks_failed......: 0.00%   0 out of 712130

    ✓ GET /de/fuhrpark: status ok

    HTTP
    http_req_duration..............: avg=23.36ms min=4.28ms med=12.55ms max=1.54s p(90)=51.8ms p(95)=73.23ms
      { expected_response:true }...: avg=23.36ms min=4.28ms med=12.55ms max=1.54s p(90)=51.8ms p(95)=73.23ms
    http_req_failed................: 0.00%  0 out of 712130
    http_reqs......................: 712130 96.483238/s

    EXECUTION
    iteration_duration.............: avg=1.02s   min=1s     med=1.01s   max=2.54s p(90)=1.05s  p(95)=1.07s  
    iterations.....................: 712130 96.483238/s
    vus............................: 1      min=1           max=100
    vus_max........................: 100    min=100         max=100

    NETWORK
    data_received..................: 188 GB 25 MB/s
    data_sent......................: 1.2 GB 162 kB/s




running (2h03m00.9s), 000/100 VUs, 712130 complete and 0 interrupted iterations
default ✓ [======================================] 000/100 VUs  2h3m0s
```