# Práctica II

Se desea crear una API GraphQL para un recetario. La aplicacón contendrá:

**Recetas** que contienen:
  * Título
  * Descripción
  * Fecha de introducción
  * Autor
  * Ingredientes

**Autores**:
  * Nombre
  * e-mail.
  * Lista de recetas

**Ingredientes**
  * Nombre
  * Recetas en los que aparecen.


## Paso I (3 puntos)

Crear las mutaciones necesarias para poder añadir:
  - [x] Recetas.
  - [x] Autores.
  - [X] Ingredientes.

## Paso II (3 puntos)

Crear las queries necesarias para poder consultar:
 - [x] Lista de recetas.
 - [x] Lista de autores.
 - [x] Lista de ingredientes.
 - [x] Recetas de un autor específico.
 - [x] Recetas que contienen un ingrediente específico.

## Paso III (4 puntos)

Crear las mutaciones necesarias para poder:
 - [x] Borrar una receta.
 - [x] Borrar un autor. Al borrar un autor, se borran todas sus recetas.
 - [x] Borrar un ingrediente. Al borrar un ingrediente, se borran todas las recetas que lo contengan.
 - [x] Actualizar datos de un autor.
 - [x] Actualizar datos de una receta.
 - [x] Actualizar datos de un ingrediente.