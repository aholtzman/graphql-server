const { graphql, buildSchema } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')

const PORT = process.env.PORT || 3000
const server = express()

const schema = buildSchema(`
  type Video {
    title: String,
    id: ID,
    duration: Int,
    watched: Boolean,
  }

  type Query {
    video: Video,
    videos: [Video]
  }

  type Schema {
    query: Query
  }
`)

const videoA = {
  id: 'a',
  title: 'graphql lesson 1',
  duration: 120,
  watched: true,
}

const videob = {
  id: 'b',
  title: 'graphql lesson 2',
  duration: 10,
  watched: true,
}

const videos = [videoA, videob]

const resolvers = {
  video: () => ({
    id: '1',
    title:'bar',
    duration: 180,
    watched: true,
  }),
  videos: () => videos

}

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  rootValue: resolvers,
}))
