import { GraphQLServer } from "graphql-yoga";
import * as uuid from "uuid";

const recipesData = [
  // {
  //   id: "f9ce5671-ced5-49f0-9d95-b805107e4307",
  //   title: "title1",
  //   description: "descripcion1",
  //   author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  //   ingredients: ["2cf2c8e2-9c20-4d9e-88d3-0e3854362301"],
  //   date: 4,
     
  // },
  // {
  //   id: "c35b0de5-69b3-44eb-b92e-f66346bcba8f",
  //   title: "receta2",
  //   description: "descripcion2",
  //   author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  //   ingredients: ["fb466cc5-973d-44dc-b838-ce2dae423f90", "2cf2c8e2-9c20-4d9e-88d3-0e3854362301"],
  //   date: 4,
  // },
  // {
  //   id: "e97382fd-0283-48e9-b76e-96c97524939d",
  //   title: "receta3",
  //   description: "descripcion3",
  //   author: "abde6470-293e-459f-ac01-e66f8e57d191",
  //   ingredients: ["f9ce5671-ced5-49f0-9d95-b805107e4307", "f9ce5671-ced5-49f0-9d95-b805107e4307"],
  //   date: 4,
  // }
];

const authorsData = [
  {
    name: "Andrés Bravo",
    email: "yo@correo.com",
    id: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
    recipes: []
  },
  {
    name: "Laura Rodríguez",
    email: "ella@.com",
    id: "abde6470-293e-459f-ac01-e66f8e57d191",
    recipes: []
  }
];

const ingredientsData = [
  {
    id: "2cf2c8e2-9c20-4d9e-88d3-0e3854362301",
    name: "tomate",
    recipes: []
  },
  {
    id: "9f28c050-0ca6-4ac3-9763-79b3a4a323f2",
    name: "zanahoria",
    recipes: []
  },
  {
    id: "fb466cc5-973d-44dc-b838-ce2dae423f90",
    name: "lechuga",
    recipes: []
  }
  
];

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
        recipes: [Recipe]
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
      const result = parent.ingredients.map(element =>{ 
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        console.log(ingredientInfo);
        return{
          name: ingredientInfo.name,
          id: ingredientInfo.id
        };
      });
      return result;
      } 
    },

  Author: {
    recipes: (parent, args, ctx, info) =>{
      const authorID = parent.id;
      return recipesData.filter(obj => obj.author === authorID);
    }
  },

  Ingredient: {
    recipes: (parent, args, ctx, info) => {
      const result = parent.recipes.map(element =>{
        const recipeInfo = recipesData.find(obj => obj.id === element);
        return{
          title: recipeInfo.title,
          id: recipeInfo.id,
          description: recipeInfo.description,
          date: recipeInfo.date,
          author: recipeInfo.author,
          ingredients: recipeInfo.ingredients,
        };
      });
      return result;
    }
  },

  Query: {
    recipe: (parent, args, ctx, info) => {
      if (!recipesData.some(obj => obj.id === args.id)) {
        throw new Error(`Unknown recipe with ID: ${args.id}`);
      }
      const result = recipesData.find(obj => obj.id === args.id);
      return result;
    },
    author: (parent, args, ctx, info) => {
      if (!authorsData.some(obj => obj.id === args.id)) {
        throw new Error(`Unknown author with ID: ${args.id}`);
      }

      const result = authorsData.find(obj => obj.id === args.id);
      return result;
    },
    ingredient: (parent, args, ctx, info) => {
      if (!ingredientsData.some(obj => obj.id === args.id)) {
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
      const autorObjeto = authorsData.find(obj => obj.id === author);
      autorObjeto.recipes.push(id);
      console.log(autorObjeto);
      ingredients.map(element => {
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        ingredientInfo.recipes.push(id);
      });
      recipesData.push(recipe);
      return recipe;
    },

    addAuthor: (parent, args, ctx, info) => {
      const { name, email } = args;
      if (authorsData.some(obj => obj.email === email)) {
        throw new Error(`User email ${email} already in use`);
      }
      const id = uuid.v4();
      const author = {
        name,
        email,
        id,
        recipes
      };

      authorsData.push(author);
      return author;
    },

    addIngredient: (parent, args, ctx, info) => {
      const { name } = args;
      const id = uuid.v4();
      const ingredient = {
        name,
        id
      };

      ingredientsData.push(ingredient);
      return ingredient;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server started"));