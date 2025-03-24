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

function magicMath(n, memo = {}) {
    if (cache.has(n)) {
        console.log(`Cache hit for n = ${n}`);
        return cache.get(n);
    }
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    // Using recursion with memoization for small N
    if (n < 1000) {
        if (memo[n]) return memo[n];
        memo[n] = magicMath(n - 1, memo) + magicMath(n - 2, memo) + n;
        cache.set(n, memo[n]);
        return memo[n];
    }

    // Using iteration for large N (to avoid stack overflow)
    let prev2 = BigInt(0), prev1 = BigInt(1), result = BigInt(0);
    for (let i = 2; i <= n; i++) {
        result = prev1 + prev2 + BigInt(i);
        prev2 = prev1;
        prev1 = result;
    }
    cache.set(n, result.toString());
    return result.toString();
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
