'use strict'
var memoize = require('memoizee')
var get = require('lodash.get')

const validOp = op => {
  if (op === 'find' || op === 'findOne' || op === 'estimatedDocumentCount') {
    return op
  } else {
    return Math.floor(Math.random() * 10000)
  }
}

module.exports = function(options) {
  if (get(options, 'cache', false)) {
    return memoize(
      function(query, queryOptions) {
        const promise = new Promise((resolve, reject) => {
          if (!queryOptions) {
            return resolve(query)
          }

          if (queryOptions.query) {
            query.where(queryOptions.query)
          }

          if (queryOptions.skip) {
            query.skip(queryOptions.skip)
          }

          if (options.limit && (!queryOptions.limit || queryOptions.limit === '0' || queryOptions.limit > options.limit)) {
            queryOptions.limit = options.limit
          }

          if (queryOptions.limit && query.op !== 'count' && !queryOptions.distinct) {
            query.limit(queryOptions.limit)
          }

          if (queryOptions.sort) {
            query.sort(queryOptions.sort)
          }

          if (queryOptions.populate) {
            query.populate(queryOptions.populate)
          }

          if (queryOptions.select) {
            query.select(queryOptions.select)
          }

          if (queryOptions.distinct) {
            query.distinct(queryOptions.distinct)
          }

          if (options.readPreference) {
            query.read(options.readPreference)
          }

          if (options.lean) {
            query.lean(options.lean)
          }

          resolve(query)
        })

        return promise
      },
      {
        promise: true,
        maxAge: get(options, 'cache_age', 5000),
        profileName: 'Query Funciton',
        normalizer: function(args) {
          const arg = {
            collectionName: get(args[0], 'mongooseCollection.collectionName', ''),
            op: validOp(get(args[0], 'op', '')),
            query: get(args, '[1]', {}),
            conditions: get(args[0], '_conditions', '')
          }
          return JSON.stringify(arg)
        }
      }
    )
  } else {
    return function(query, queryOptions) {
      const promise = new Promise((resolve, reject) => {
        if (!queryOptions) {
          return resolve(query)
        }

        if (queryOptions.query) {
          query.where(queryOptions.query)
        }

        if (queryOptions.skip) {
          query.skip(queryOptions.skip)
        }

        if (options.limit && (!queryOptions.limit || queryOptions.limit === '0' || queryOptions.limit > options.limit)) {
          queryOptions.limit = options.limit
        }

        if (queryOptions.limit && query.op !== 'count' && !queryOptions.distinct) {
          query.limit(queryOptions.limit)
        }

        if (queryOptions.sort) {
          query.sort(queryOptions.sort)
        }

        if (queryOptions.populate) {
          query.populate(queryOptions.populate)
        }

        if (queryOptions.select) {
          query.select(queryOptions.select)
        }

        if (queryOptions.distinct) {
          query.distinct(queryOptions.distinct)
        }

        if (options.readPreference) {
          query.read(options.readPreference)
        }

        if (options.lean) {
          query.lean(options.lean)
        }

        resolve(query)
      })

      return promise
    }
  }
}
