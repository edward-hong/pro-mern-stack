const fs = require('fs')
const express = require('express')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { ApolloServer, UserInputError } = require('apollo-server-express')

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
  validateIssue(issue)
  issue.created = new Date()
  issue.id = issueDB.length + 1
  issueDB.push(issue)
  return issue
}

function validateIssue(issue) {
  const errors = []
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long')
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"')
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors })
  }
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
    const dateValue = new Date(value)
    return isNaN(dateValue) ? undefined : dateValue
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value)
      return isNaN(value) ? undefined : value
    }
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
  formatError: (error) => {
    console.log(error)
    return error
  },
})

const app = express()

app.use(express.static('public'))

server.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`App started on port ${PORT}`))
