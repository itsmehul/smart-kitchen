/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sjson = require('./subrecipestomap.json');

// Use script to write json file from existing api data


transformedDishes = sjson.reduce((a,b) => ({
    ...a,
    [b.variantName]: b.id
  }),{});


fs.writeFile('./subrecipes/mappedSubrecipes.json', JSON.stringify(transformedDishes), () => {
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

