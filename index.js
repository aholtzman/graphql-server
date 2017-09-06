const {
  GraphQLSchema,
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { getVideoById, getVideos, createVideo } = require('./src/data')
const { nodeInterface, nodeField } = require('./src/node')
const {
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
  mutationWithClientMutationId,
 } = require('graphql-relay')

const PORT = process.env.PORT || 3000
const server = express()

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video lesson on graphql',
  fields: {
    id: globalIdField(),
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
  },
  interfaces: [nodeInterface],
})

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'a count of all objects',
      resolve: (conn) => {
        return conn.edges.length
      },
    },
  })
})

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args,
      ),
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description:'the video id'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id)
      }
    }
  }
})

const videoMutation = mutationWithClientMutationId({
  name: 'AddVideo',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video.',
      },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video (in seconds).',
      },
    watched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video is watched.',
      },
  },
  outputFields: {
    video: {
      type: videoType,
    }
  },
  mutateAndGetPayload: (args) => new Promise((resolve, reject) => {
    Promise.resolve(createVideo(args))
      .then((video) => resolve({ video }))
      .catch(reject)
  })
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: videoMutation,
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})

server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

exports.videoType = videoType
