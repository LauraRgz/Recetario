import { GraphQLServer } from "graphql-yoga";
import * as uuid from "uuid";
import chalk from "chalk";
import { removeRecipeFunction } from "./utils";
//import { removeRecipeFunction } from "../utils";
const recipesData = [];
const authorsData = [];
const ingredientsData = [];

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
        showRecipes: [Recipe]
        showAuthors: [Author]
        showIngredients: [Ingredient]

    }
    type Mutation{
        addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID]!): Recipe!
        addAuthor(name: String!, email: String!): Author!
        addIngredient(name: String!): Ingredient!
        removeRecipe(id: ID!): String!
        removeAuthor(id: ID!): String!
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
      const result = parent.ingredients.map(element => {
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        return ingredientInfo;
      });
      return result;
    }
  },

  Author: {
    recipes: (parent, args, ctx, info) => {
      const authorID = parent.id;
      return recipesData.filter(obj => obj.author === authorID);
    }
  },

  Ingredient: {
    recipes: (parent, args, ctx, info) => {
      const result = parent.recipes.map(element => {
        const recipeInfo = recipesData.find(obj => obj.id === element);
        return recipeInfo;
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
    },
    showRecipes: (parent, args, ctx, info) => {
      return recipesData.map(elem => {
        return elem;
      });
    },
    showAuthors: (parent, args, ctx, info) => {
      return authorsData.map(elem => {
        return elem;
      });
    },
    showIngredients: (parent, args, ctx, info) => {
      return ingredientsData.map(elem => {
        return elem;
      });
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
      ingredients.map(element => {
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        ingredientInfo.recipes.push(id);
      });
      recipesData.push(recipe);
      console.log(
        chalk.cyanBright(
          `\n Recipe ${chalk.bold(
            recipe.title
          )} added sucessfully! \n ID: ${chalk.bold(recipe.id)}`
        )
      );
      return recipe;
    },

    addAuthor: (parent, args, ctx, info) => {
      const { name, email } = args;
      if (authorsData.some(obj => obj.email === email)) {
        throw new Error(`User email ${email} already in use`);
      }
      const recipes = [];
      const id = uuid.v4();
      const author = {
        name,
        email,
        id,
        recipes
      };

      authorsData.push(author);
      console.log(
        chalk.magentaBright(
          `\n Author ${chalk.bold(
            author.name
          )} added sucessfully! \n ID: ${chalk.bold(author.id)}`
        )
      );
      return author;
    },

    addIngredient: (parent, args, ctx, info) => {
      const { name } = args;
      const id = uuid.v4();
      const recipes = [];
      const ingredient = {
        name,
        id,
        recipes
      };

      ingredientsData.push(ingredient);
      console.log(
        chalk.greenBright(
          `\n Ingredient ${chalk.bold(
            ingredient.name
          )} added sucessfully! \n ID: ${chalk.bold(ingredient.id)}`
        )
      );
      return ingredient;
    },
    removeRecipe: (parent, args, ctx, info) => {
      //const { id } = args;
      console.log(args);
      removeRecipeFunction(args);
      // const result = recipesData.find(obj => obj.id === id);
      // if (result) {
      //   recipesData.splice(recipesData.indexOf(result), 1);
      //   const result1 = authorsData.find(obj => obj.id === result.id);
      //   const result2 = ingredientsData.find(obj => obj.id === result.id);
      //   if (result1) {
      //     authorsData.splice(authorsData.indexOf(result1), 1);
      //     console.log(chalk.redBright(`Recipe removed from author ${result1.name}`));
      //   }
      //   if(result2){
      //     ingredientsData.splice(ingredientsData.indexOf(result2));
      //     console.log(chalk.redBright(`Recipe removed from ingredient ${result2.name}`));
      //   }
      // } else {
      //   throw new Error(`Recipe ${id} not found`);
      // }
      // return "Receta eliminada correctamente";
    },
    removeAuthor: (parent, args, ctx, info) => {
      const { id } = args;
      const result = authorsData.find(obj => obj.id === id);
      if (result){
        authorsData.splice(authorsData.indexOf(result), 1);
        const resultRecipe = recipesData.find(obj => obj.id === result.id);
        

      }
    }
  }
};

export {authorsData, ingredientsData, recipesData};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server started"));
