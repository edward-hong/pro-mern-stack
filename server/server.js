const fs = require('fs')
const express = require('express')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { MongoClient } = require('mongodb')
const { ApolloServer, UserInputError } = require('apollo-server-express')

const url =
  'mongodb+srv://edward:drowssap@issues-app-18dby.mongodb.net/issueTracker?retryWrites=true&w=majority'
let db

let aboutMessage = 'Issue Tracker API v1.0'

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

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray()
  return issues
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

async function connectToDb() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  await client.connect()
  console.log('Connected to MongoDb')
  db = client.db()
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

;(async function () {
  try {
    await connectToDb()
    app.listen(PORT, () => console.log(`App started on port ${PORT}`))
  } catch (err) {
    console.log('ERROR', err)
  }
})()
