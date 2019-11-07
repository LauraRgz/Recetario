import { GraphQLServer } from "graphql-yoga";
import * as uuid from "uuid";
import chalk from "chalk";
import { removeRecipeFunction } from "./utils";

let recipesData = [];
let authorsData = [];
let ingredientsData = [];

//Mongo Atlas (mLab) alojamiento: google. Europa
//Promises
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
        removeIngredient(id: ID!): String!
        updateAuthor(id: ID!, name: String, email: String): Author!
        updateIngredient(id: ID!, name: String!): Ingredient!
        updateRecipe(id: ID!, title: String, description: String, ingredients: [ID] ): Recipe!
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
        if (elem) {
          return elem;
        } else {
          return "No recipes found";
        }
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
        chalk.yellowBright(
          `\n Ingredient ${chalk.bold(
            ingredient.name
          )} added sucessfully! \n ID: ${chalk.bold(ingredient.id)}`
        )
      );
      return ingredient;
    },

    removeRecipe: (parent, args, ctx, info) => {
      removeRecipeFunction(args.id);
      console.log(chalk.redBright(`Recipe with ID ${args.id} deleted\n`));
      return "Receta eliminada correctamente";
    },

    removeIngredient: (parent, args, ctx, info) => {
      const ingredienteID = args.id;
      recipesData = recipesData.filter(recipe => {
        if (recipe.ingredients.includes(ingredienteID)) {
          const idAuthor = recipe.author;
          const author = authorsData.find(aut => aut.id === idAuthor);
          author.recipes = author.recipes.filter(recp => !(recp !== recipe.id));
        }
        return !recipe.ingredients.includes(ingredienteID);
      });

      ingredientsData = ingredientsData.filter(
        ingredient => !(ingredient.id === ingredienteID)
      );
      console.log(chalk.redBright(`\nIngredient with ID ${args.id} deleted\n`));
      return "Ingredient removed";
    },

    removeAuthor: (parent, args, ctx, info) => {
      const { id } = args;
      const result = authorsData.find(obj => obj.id === id);

      if (result) {
        recipesData.map(elem => {
          const aux = recipesData.find(obj => obj.author === result.id);
          removeRecipeFunction(aux.id);
        });
        authorsData.splice(authorsData.indexOf(result), 1);
      }

      console.log(chalk.redBright(`\nAuthor with ID ${args.id} deleted\n`));

      return "Author deleted";
    },

    updateAuthor: (parent, args, ctx, info) => {
      const result = authorsData.find(obj => obj.id === args.id);
      if (args.name) {
        result.name = args.name;
      }
      if (args.email) {
        result.email = args.email;
      }
      console.log(chalk.green(`\Author with ID ${args.id} updated\n`));
      return result;
    },

    updateIngredient: (parent, args, ctx, info) => {
      const result = ingredientsData.find(obj => obj.id === args.id);
      result.name = args.name;
      console.log(chalk.green(`\nIngredient with ID ${args.id} updated\n`));
      return result;
    },

    updateRecipe: (parent, args, ctx, info) => {
      const result = recipesData.find(obj => obj.id === args.id);
      if (args.title) result.title = args.title;
      if (args.description) result.description = args.description;

      if (args.ingredients) {
        const oldIngredients = result.ingredients.map(ingredienteID => {
          return ingredientsData.find(obj => obj.id === ingredienteID);
        });

        oldIngredients.forEach(elem =>
          elem.recipes.splice(elem.recipes.indexOf(result.id), 1)
        );

        const newIngredients = args.ingredients.map(ingredienteID => {
          return ingredientsData.find(obj => obj.id === ingredienteID);
        });

        newIngredients.forEach(elem => elem.recipes.push(args.id));
        result.ingredients = args.ingredients;
      }
      console.log(chalk.green(`\nRecipe with ID ${args.id} updated\n`));
      return result;
    }
  }
};

export { authorsData, ingredientsData, recipesData };

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log(chalk.green("Server started")));
