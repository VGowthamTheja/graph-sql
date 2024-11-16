const express = require('express');
const {ApolloServer} = require('@apollo/server')
const {startStandaloneServer} = require('@apollo/server/standalone')
const { resolvers, typeDefs } = require('./graphql')
const db = require('./models');
require('dotenv').config();

// const app = express();

const server = new ApolloServer({ typeDefs, resolvers });


db.sequelize.sync().then(async () => {
  const {url} = await startStandaloneServer(server, {
    listen: {port: 4000}
  })
  console.log(`Server ready at ${url}`)
});
