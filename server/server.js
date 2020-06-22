const fs = require('fs')
const express = require('express')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { ApolloServer } = require('apollo-server-express')

let aboutMessage = 'Issue Tracker API v1.0'

const issueDB = [
  {
    id: 1,
    status: 'New',
    owner: 'Ravan',
    effort: 5,
    created: new Date('2018-08-15'),
    due: undefined,
    title: 'Error in console when clicking Add',
  },
  {
    id: 2,
    status: 'Assigned',
    owner: 'Eddie',
    effort: 14,
    created: new Date('2018-08-16'),
    due: new Date('2018-08-30'),
    title: 'Missing bottom border on panel',
  },
]

function setAboutMessage(_, { message }) {
  return (aboutMessage = message)
}

function issueAdd(_, { issue }) {
  issue.created = new Date()
  issue.id = issueDB.length + 1
  if (issue.status === undefined) issue.status = 'New'
  issueDB.push(issue)
  return issue
}

function issueList() {
  return issueDB
}

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString()
  },
  parseValue(value) {
    return new Date(value)
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : undefined
  },
})

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
})

const app = express()

app.use(express.static('public'))

server.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`App started on port ${PORT}`))
