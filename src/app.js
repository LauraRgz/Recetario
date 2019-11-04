import { GraphQLServer } from "graphql-yoga";
import * as uuid from "uuid";
//338b6f8a-9a45-4e09-b883-8aa898007fa4
console.log(authorsData);
const recipesData = [
  {
    title: "Receta1",
    description: "Descripcion Receta1",
    author: {
      name: "Autor1"
    },
    ingredients: [
      {
        name: "Ingrediente1"
      },
      {
        name: "Ingrediente2"
      },
      {
        name: "Ingrediente3"
      }
    ],
    date: "4",
    id: "ac6c841d-7711-428b-89c5-dd8944dc4ab4"
  },
  {
    title: "Receta2",
    description: "Descripcion Receta2",
    date: "4",
    author: {
      name: "Autor2",
      id: "6b9080e7-7b05-4b4c-bfdf-36e8e2013c43"
    },
    ingredients: [
      {
        name: "Ingrediente2",
        id: "3989b32f-6989-4129-a260-869ce96c489d"
      },
      {
        name: "Ingrediente3",
        id: "1685889b-03ad-4a65-b4b4-bee39b2a741a"
      }
    ],
    id: "67b55531-aec7-49b5-8e5f-a4e26f2e991c"
  }
];

const authorsData = [
  {
    name: "Autor1",
    email: "autor1@gmail.com",
    //recipes: "ac6c841d-7711-428b-89c5-dd8944dc4ab4",
    id: "cf91012a-8e25-437d-bd8d-5d1534a8b9fa"
  },
  {
    name: "Autor2",
    email: "autor2@gmail.com",
    //recipes: "ac6c841d-7711-428b-89c5-dd8944dc4ab4",
    id: "6b9080e7-7b05-4b4c-bfdf-36e8e2013c43"
  },
  {
    name: "Autor3",
    email: "autor3@gmail.com",
    //recipes: "ac6c841d-7711-428b-89c5-dd8944dc4ab4",
    id: "9bd4ae80-fc0b-4621-917d-9c17a160e3ae"
  }
];

const ingredientsData = [
  { name: "Ingrediente1", id: "40014aad-8729-40d0-9c33-2cac9039bcf0" },
  { name: "Ingrediente2", id: "3989b32f-6989-4129-a260-869ce96c489d" },
  { name: "Ingrediente3", id: "1685889b-03ad-4a65-b4b4-bee39b2a741a" }
];
console.log(authorsData);
const typeDefs = `
    type Recipe{
        title: String!
        description: String!
        date: String!
        author: Author!
        ingredients: [Ingredient]!
        id: ID!
    }
    type Author{
        name: String!
        email: String!
        recipes: Recipe
        id: ID!
    }
    type Ingredient{
        name: String!
        recipes: [Recipe]
        id: ID!
    }
    type Query{
        recipe(id: ID!): Recipe
        author(id: ID!): Author
        ingredient(id: ID!): Ingredient
    }
    type Mutation{
        addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID]!): Recipe!
        addAuthor(name: String!, email: String!): Author!
        addIngredient(name: String!): Ingredient!
    }
`;

const resolvers = {
  Recipe: {
    author: (parent, args, ctx, info) => {
      const authorID = parent.author;
      const result = authorsData.find(obj => obj.id === authorID);
      return result;
    },
    ingredients: (parent, args, ctx, info) => {
      const result = parent.ingredients.map(ingredient => {
        const ingredientInfo = ingredientsData.find(
          obj => obj.id === ingredient
        );
        return {
          name: ingredientInfo.name,
          id: ingredientInfo.id
        };
      });
      return result;
    }
  },

  Author: {
    recipes: (parent, args, ctx, info) => {
      const authorID = parent.id;
      console.log(authorID);
      return recipesData.filter(obj => obj.author === authorID);
    }
  },

  Ingredient: {
    recipes: (parent, args, ctx, info) => {
      const ingredientID = parent.id;
      return recipesData.filter(obj => obj.ingredients === ingredientID);
    }
  },

  Query: {
    recipe: (parent, args, ctx, info) => {
      if (recipesData.some(obj => obj.id === args.id)) {
        throw new Error(`Unknown recipe with ID: ${args.id}`);
      }
      const result = recipesData.find(obj => obj.id === args.id);
      return result;
    },
    author: (parent, args, ctx, info) => {
      // if (authorsData.some(obj => obj.id === args.id)) {
      //   throw new Error(`Unknown author with ID: ${args.id}`);
      // }

      const result = authorsData.find(obj => obj.id === args.id);
      return result;
    },
    ingredient: (parent, args, ctx, info) => {
      if (ingredientsData.some(obj => obj.id === args.id)) {
        throw new Error(`Unknown ingredient with ID: ${args.id}`);
      }

      const result = ingredientsData.find(obj => obj.id === args.id);
      return result;
    }
  },
  Mutation: {
    addRecipe: (parent, args, ctx, info) => {
      const { title, description, author, ingredients } = args;

      const date = new Date().getDate();
      const id = uuid.v4();

      const recipe = {
        title,
        description,
        date,
        author,
        ingredients,
        id
      };

      recipesData.push(recipe);
      return recipe;
    },

    addAuthor: (parent, args, ctx, info) => {
      const { name, email } = args;
      if (authorsData.some(obj => obj.email === email)) {
        throw new Error(`User email ${email} already in use`);
      }
      const author = {
        name,
        email,
        id: uuid.v4()
      };

      authorsData.push(author);
      return author;
    },

    addIngredient: (parent, args, ctx, info) => {
      const { name } = args;
      const ingredient = {
        name,
        id: uuid.v4()
      };

      ingredientsData.push(ingredient);
      return ingredient;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server started"));
