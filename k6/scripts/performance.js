import http from 'k6/http';

export const options = {
    scenarios: {
        frontend: {
            executor: 'per-vu-iterations',
            vus: 1000,
            iterations: 1,
            maxDuration: '30s',
        },
    },
};

export default function () {
    http.get('https://localhost:8443/de/fuhrpark');
}