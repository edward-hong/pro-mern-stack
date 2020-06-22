const express = require('express')
const { ApolloServer } = require('apollo-server-express')

let aboutMessage = 'Issue Tracker API v1.0'

const typeDefs = `
  type Query {
    about: String!
  }
  type Mutation {
    setAboutMessage(message: String!): String
  }
`

function setAboutMessage(_, { message }) {
  return (aboutMessage = message)
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
  },
  Mutation: {
    setAboutMessage,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()

app.use(express.static('public'))

server.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`App started on port ${PORT}`))
