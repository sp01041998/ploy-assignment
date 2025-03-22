# 🚀 Magic Math API

## 📖 Overview
Magic Math is a mathematical function defined as:


This API calculates the **Magic Math** function efficiently using a **hybrid approach**:
- **Recursion with Memoization** for small `N`
- **Iterative Calculation** for large `N` (avoiding stack overflow)
- **BigInt Support** for very large numbers

The API is exposed over a REST endpoint using **Node.js** and **Express.js**.

---

## 📦 Installation

1. Clone this repository:
   git clone https://github.com/your-username/magic-math-api.git
   cd magic-math-api

2. Install dependencies:
    npm install

3. Start the Server:
    npm run dev

4. Send a GET request:
    curl http://127.0.0.1:5000/magic-math/10

5. Example Response:
    {
        "N":5,
        "magicMath":26
    }
