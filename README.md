# What is this?
A rate limiter implemented as an express middleware. The limiter uses a Redis sorted set. This is how it works:
  - Writes a timestamp to a sorted set namespaced to the request IP
  - Removes all records from this set that are older than a given interval (1 minute by default)
  - Counts the records in the set
    - If the count is above the given limit (100 by default) then it returns a 429 response
    - Otherwise the request continues

# Development
Clone the repo:

    git clone https://github.com/BlairCurrey/redis-rate-limiter.git

Install:

    npm i

Start a redis server:

    docker run -it -d --rm --name redis-rl-server -p 6379:6379 redis

Start the Express server:

    npm start

Send a request:

    curl localhost:3000

Send too many requests:

    for i in {1..11}; do curl -w "\n" localhost:3000; done