// const { gql } = require('@apollo/server');
const db = require('../models');

const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

const userResolvers = {
  Query: {
    users: async () => {
      try {
        const users = await db.User.findAll();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users. Please try again later.");
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await db.User.findByPk(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found.`);
        }
        return user;
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw new Error(error.message || "Failed to fetch user. Please try again.");
      }
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      try {
        const newUser = await db.User.create({ name, email });
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);

        // Handle unique constraint errors (specific to PostgreSQL)
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new Error("A user with this email already exists.");
        }

        throw new Error("Failed to create user. Please try again");
      }
    },
  },
};


module.exports = { userTypeDefs, userResolvers };
