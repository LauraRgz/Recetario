## Table of contents
* [Mutation Add recipe](#Add-Recipe)
* [Mutation Add author](#Add-Author)
* [Mutation Add ingredient](#Add-Ingredient)
* [Mutation Remove recipe](#Remove-Recipe)
* [Mutation Remove author](#Remove-Author)
* [Mutation Remove ingredient](#Remove-Ingredient)
* [Mutation Update recipe](#Update-Recipe)
* [Mutation Update author](#Update-Author)
* [Mutation Update ingredient](#Update-Ingredient)
* [Query Recipe](#Recipe)
* [Query Author](#Author)
* [Query Ingredient](#Ingredient)

* [Query Show recipes](#Show-Recipes)
* [Query Show authors](#Show-Authors)
* [Query Show ingredients](#Show-ingredients)

## Mutations
### Add Author
Authors are added introducing the name and email. The ID is randomly generated.
#### Example
```js
mutation{
  addAuthor(name: "Laura Rodríguez", email: "laura@yo.com"){
    id,
    name,
    email
  }
}
```
#### Result
```js
{
  "data": {
    "addAuthor": {
      "id": "583ab4d8-8cba-4805-854a-1b41a3f98d6f",
      "name": "Laura Rodríguez",
      "email": "laura@yo.com"
    }
  }
}
```

### Add Ingredient
You can add an ingredient by entering its name.
#### Example
```js
mutation{
  addIngredient(name: "Harina"){
    id,
    name
  }
}
```
#### Result
```js
{
  "data": {
    "addIngredient": {
      "id": "38eb196c-ce0c-4ff7-9602-8f071fcbd49c",
      "name": "Pan"
    }
  }
}
```

### Add Recipe
To add a new recipe, you need to provide a title, description, author and the ingredients.
#### Example
```js
mutation{
  addRecipe(title: "Receta 1",
    				description: "Descripción Receta 1",
  					author: "3007e18d-d872-454a-bacc-55fbbb02dc22",
  					ingredients: ["97290368-0b41-4ca8-bf9e-af9873aec5f2"]){
    id,
    title,
    description,
    date,
    author{id, name, email, recipes{title}},
    ingredients{id, name, recipes{title}}
  }
}
```
#### Result
```js
{
  "data": {
    "addRecipe": {
      "id": "38e205f7-5119-4324-a7dc-b733d67c7dba",
      "title": "Receta 1",
      "description": "Descripción Receta 1",
      "date": "8",
      "author": {
        "id": "583ab4d8-8cba-4805-854a-1b41a3f98d6f",
        "name": "Laura Rodríguez",
        "email": "laura@yo.com",
        "recipes": [
          {
            "title": "Receta 1"
          }
        ]
      },
      "ingredients": [
        {
          "id": "38e205f7-5119-4324-a7dc-b733d67c7dba",
          "name": "Pan",
          "recipes": [
            {
              "title": "Receta 1"
            }
          ]
        }
      ]
    }
  }
}
```

### Remove Recipe
#### Example
```js
mutation{
  removeRecipe(id: "7aa9917c-85c3-443f-a5f5-8b923a4f6c4d")
}
```
#### Result
```js
{
  "data": {
    "removeRecipe": "Recipe removed"
  }
}
```

### Remove Author
#### Example
```js
mutation{
  removeAuthor(id: "f27420a9-2135-4c3c-afdb-65b0eb190238")
}
```
#### Result
```js
{
  "data": {
    "removeAuthor": "Author deleted"
  }
}
```

### Remove Ingredient
#### Example
```js
mutation{
  removeIngredient(id: "38eb196c-ce0c-4ff7-9602-8f071fcbd49c")
}
```
#### Result
```js
{
  "data": {
    "removeIngredient": "Ingredient removed"
  }
}
```

### Update Recipe
To update a recipe, you need to enter its ID and the new parameters(title, description or/and ingredients).
#### Example
```js
mutation{
  updateRecipe (id: "b2c31e37-241a-4ae0-a0d7-1d5b18fb1012" ,
    						title: "Bread",
    						description: "Nueva descripción", 
    						ingredients: ["5be7f4c9-a790-459d-aa6d-b7782f5db967"]){
     id,
    title,
    description,
    date,
    author{id, name, email, recipes{title}},
    ingredients{id, name, recipes{title}}
  }
}
```
#### Result
```js
{
  "data": {
    "updateRecipe": {
      "id": "b2c31e37-241a-4ae0-a0d7-1d5b18fb1012",
      "title": "Bread",
      "description": "Nueva descripción",
      "date": "8",
      "author": {
        "id": "8e2e5f31-6d79-40cb-a94d-441f1cd4900f",
        "name": "Laura Rodríguez",
        "email": "laura@yo.com",
        "recipes": [
          {
            "title": "Bread"
          }
        ]
      },
      "ingredients": [
        {
          "id": "5be7f4c9-a790-459d-aa6d-b7782f5db967",
          "name": "bread",
          "recipes": [
            {
              "title": "Bread"
            }
          ]
        }
      ]
    }
  }
}
```

### Update Author
When you update an author's information, you need to provide its ID and the new parameters(name and email).
#### Example
```js
mutation{
  updateAuthor(id: "b66be745-e911-49f9-8b72-fd7c7651bdc2", name: "Eustaquio"){
    id,
    name,
    email
  }
}
```
#### Result
```js
{
  "data": {
    "updateAuthor": {
      "id": "8e2e5f31-6d79-40cb-a94d-441f1cd4900f",
      "name": "Andrés",
      "email": "Andres@yo.com"
    }
  }
}
```

### Update Ingredient
To update a ingredient you need to enter the ID and the new name.
#### Example
```js
mutation{
  updateIngredient(id: "5a0a3c07-4ee3-4e8b-b10f-4f34a9fc7aea", name: "Tomate"){
    name,
    id
  }
}
```
#### Result
```js
{
  "data": {
    "updateIngredient": {
      "name": "Tomate",
      "id": "5be7f4c9-a790-459d-aa6d-b7782f5db967"
    }
  }
}
```

## Queries
### Recipe
#### Example
```js
query{
  recipe(id: "b2c31e37-241a-4ae0-a0d7-1d5b18fb1012"){
    id
    title
    description
    date
    author{name}
    ingredients{name}
  }
}
```
#### Result
```js
{
  "data": {
    "recipe": {
      "id": "b2c31e37-241a-4ae0-a0d7-1d5b18fb1012",
      "title": "Bread",
      "description": "Nueva descripción",
      "date": "8",
      "author": {
        "name": "Andrés"
      },
      "ingredients": [
        {
          "name": "Tomate"
        }
      ]
    }
  }
}
```

### Author
#### Example
```js
query{
  author(id: "8e2e5f31-6d79-40cb-a94d-441f1cd4900f"){
  	id
    name
    email
  }
}
```

### Ingredient
#### Example
```js
query{
  ingredient(id: "5be7f4c9-a790-459d-aa6d-b7782f5db967"){
  	id
    name
  }
}
```

### Show Recipes
#### Example
```js
query{
  showRecipes{
    title
    id
    date
    description
    ingredients{name}
    author{name}
  }
}
```

### Show Authors
#### Example
```js
query{
  showAuthors{
    id
    name
    email
  }
}
```

### Show Ingredients

#### Example
```js
query{
  showIngredients{
  	id
    name
  }
}
```

