# Introduction

Fork [express restify mongoose](https://github.com/florianholzapfel/express-restify-mongoose) 

This is a fork version of express restify mongoose. In this fork, we used [memoizee](https://github.com/medikoo/memoizee) to implement data query caching.
In order to use this feature, you need to add two new options:
- cache: set this to true to enable caching (default: false)
- cache_age: time to live of the cached data (default: 5000 ms)