const {
  GraphQLSchema,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')

const PORT = process.env.PORT || 3000
const server = express()

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video lesson on graphql',
  fields: {
    id: {
      type: GraphQLID,
      description: "the id of the video"
    },
    title: {
      type: GraphQLString,
      description: 'video title',
    },
    duration: {
      type: GraphQLInt,
      description: 'length of video'
    },
    watched: {
      type: GraphQLBoolean,
      description: 'was video watched'
    },
  }
})

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    video: {
      type: videoType,
      resolve: () => new Promise((resolve) => {
        resolve({
          id: 'a',
          title: 'graphql lesson 1',
          duration: 120,
          watched: true,
        })
      })
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
})


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


server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))
