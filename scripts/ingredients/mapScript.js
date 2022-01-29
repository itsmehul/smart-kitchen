/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sjson = require('./ingredients.json');

// Use script to write json file from existing api data


transformedDishes = sjson.reduce((a,b) => ({
    ...a,
    [b.name]: b.id
  }),{});


fs.writeFile('mappedIngredients.json', JSON.stringify(transformedDishes), () => {
  console.log('fone');
});

// .reduce((a, b) => {
//   return {
//     ...a,
//     [b.recipeId]: {
//       ...b,
//       ingredients: a[b.recipeId]?.ingredients
//         ? [...a[b.recipeId]?.ingredients, b.ingredientId]
//         : b.ingredientId
//         ? [b.ingredientId]
//         : [],
//     },
//   };
// }, {});

