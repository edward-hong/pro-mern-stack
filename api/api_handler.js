require('dotenv').config()

const fs = require('fs')
const { ApolloServer } = require('apollo-server-express')

const GraphQLDate = require('./graphql_date')
const { setMessage, getMessage } = require('./about')
const { list, add, get } = require('./issue')

const resolvers = {
  Query: {
    about: getMessage,
    issueList: list,
    issue: get,
  },
  Mutation: {
    setAboutMessage: setMessage,
    issueAdd: add,
  },
  GraphQLDate,
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error)
    return error
  },
})

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || true) === 'true'
  console.log('CORS setting:', enableCors)
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors })
}

module.exports = { installHandler }
