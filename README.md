# What is this?
A _sliding window rate limiter_ implemented as an express middleware. 

> **Sliding window rate limiter**: a rate limiting technique that uses a moving time window to track the number of requests made within a specific time period. The window "slides" forward with each new request, and requests that exceed the limit within the window are rejected.

The limiter uses a Redis sorted set and works as follows:
  - Writes a timestamp to a sorted set that is namespaced to the request IP
  - Removes all records from this set that are older than a given interval (1 minute by default)
  - Counts the records in the set
    - If the count is above the given limit (100 by default) then it returns a `429 Too Many Requests` response
    - Otherwise the request continues

I created this repository because I wanted to gain a better understanding of rate limiting techniques and build something from scratch. Although there are several npm packages available for rate limiting, this particular technique is relatively straightforward and implementing it yourself can help minimize dependencies.

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
