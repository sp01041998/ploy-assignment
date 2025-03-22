const express = require('express');
const rateLimit = require('express-rate-limit');
const { LRUCache } = require('lru-cache')

const app = express();
const PORT = 3000;


const cache = new LRUCache({
    max: 100, 
    maxAge: 1000 * 60 * 60
});


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

function multiplyMatrix(A, B) {
    let C = [
        [0n, 0n, 0n],
        [0n, 0n, 0n],
        [0n, 0n, 0n]
    ];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

function matrixPower(M, exp) {
    let res = [
        [1n, 0n, 0n],
        [0n, 1n, 0n],
        [0n, 0n, 1n]
    ];
    while (exp > 0) {
        if (exp % 2 === 1) res = multiplyMatrix(res, M);
        M = multiplyMatrix(M, M);
        exp = Math.floor(exp / 2);
    }
    return res;
}

function magicMath(n) {
    if (n === 0) return "0";
    if (n === 1) return "1";

    
    if (cache.has(n)) {
        console.log(`Cache hit for n = ${n}`);
        return cache.get(n);
    }

    let M = [
        [1n, 1n, 1n],
        [1n, 0n, 0n],
        [0n, 0n, 1n]
    ];

    let result = matrixPower(M, n - 1);

    let finalResult = (result[0][0] * 1n + result[0][1] * 0n + result[0][2] * BigInt(n)).toString();

    
    cache.set(n, finalResult);

    return finalResult;
}

app.get('/:n', (req, res) => {
    const n = parseInt(req?.params?.n);
    if (isNaN(n) || n < 0) {
        return res.status(400).json({ error: "N must be a non-negative integer" });
    }
    return res.json({ N: n, magicMath: magicMath(n) });
});

app.listen(PORT, () => {
    console.log(`App is running on http://127.0.0.1:${PORT}`);
});
