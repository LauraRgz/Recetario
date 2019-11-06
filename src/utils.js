import {authorsData, ingredientsData, recipesData} from "./app";

const removeRecipeFunction = function (argv){
    const result = recipesData.find(obj => obj.id === argv);
    if (result) {
      recipesData.splice(recipesData.indexOf(result), 1);
      const result1 = authorsData.find(obj => obj.id === result.id);
      const result2 = ingredientsData.find(obj => obj.id === result.id);
      if (result1) {
        authorsData.splice(authorsData.indexOf(result1), 1);
        console.log(chalk.redBright(`Recipe removed from author ${result1.name}`));
      }
      if(result2){
        ingredientsData.splice(ingredientsData.indexOf(result2));
        console.log(chalk.redBright(`Recipe removed from ingredient ${result2.name}`));
      }
    } else {
      throw new Error(`Recipe ${argv} not found`);
    }
    return "Receta eliminada correctamente";
};

export { removeRecipeFunction };