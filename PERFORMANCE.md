```

     execution: local
        script: k6/scripts/load/frontend.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 5m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 5m0s (gracefulStop: 30s)



  █ TOTAL RESULTS 

    checks_total.......: 5900   19.623832/s
    checks_succeeded...: 99.84% 5891 out of 5900
    checks_failed......: 0.15%  9 out of 5900

    ✓ /GET /fleet/: status was 200
    ✗ duration as <= 200
      ↳  99% — ✓ 2941 / ✗ 9

    HTTP
    http_req_duration..............: avg=18.42ms min=4.16ms med=17.33ms max=283.99ms p(90)=25.97ms p(95)=29.07ms
      { expected_response:true }...: avg=18.42ms min=4.16ms med=17.33ms max=283.99ms p(90)=25.97ms p(95)=29.07ms
    http_req_failed................: 0.00%  0 out of 2950
    http_reqs......................: 2950   9.811916/s

    EXECUTION
    iteration_duration.............: avg=1.01s   min=1s     med=1.01s   max=1.31s    p(90)=1.02s   p(95)=1.02s  
    iterations.....................: 2950   9.811916/s
    vus............................: 10     min=10        max=10
    vus_max........................: 10     min=10        max=10

    NETWORK
    data_received..................: 731 MB 2.4 MB/s
    data_sent......................: 2.8 MB 9.5 kB/s




running (5m00.7s), 00/10 VUs, 2950 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  5m0s
```

```
nginx compressed:
         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: k6/scripts/load/frontend.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 5m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 5m0s (gracefulStop: 30s)



  █ TOTAL RESULTS 

    checks_total.......: 8670    28.883508/s
    checks_succeeded...: 100.00% 8670 out of 8670
    checks_failed......: 0.00%   0 out of 8670

    ✓ /GET /fleet/: status was 200
    ✓ /GET /fleet/: response is gzip compressed
    ✓ duration as <= 200

    HTTP
    http_req_duration..............: avg=37.97ms min=5.78ms med=38.58ms max=69.88ms p(90)=46.94ms p(95)=49.42ms
      { expected_response:true }...: avg=37.97ms min=5.78ms med=38.58ms max=69.88ms p(90)=46.94ms p(95)=49.42ms
    http_req_failed................: 0.00%  0 out of 2890
    http_reqs......................: 2890   9.627836/s

    EXECUTION
    iteration_duration.............: avg=1.03s   min=1s     med=1.03s   max=1.07s   p(90)=1.04s   p(95)=1.05s  
    iterations.....................: 2890   9.627836/s
    vus............................: 10     min=10        max=10
    vus_max........................: 10     min=10        max=10

    NETWORK
    data_received..................: 103 MB 344 kB/s
    data_sent......................: 1.0 MB 3.4 kB/s




running (5m00.2s), 00/10 VUs, 2890 complete and 0 interrupted iterations
```