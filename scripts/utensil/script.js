/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sjson = require('./utensil.json');

// Use script to write json file from existing api data


transformedDishes = sjson.map(ing=>({
  id: ing.id,
  name: ing.name,

}))

// .reduce((a,b) => ({
//   ...a,
//   [b.name]: b.id
// }),{});

fs.writeFile('./utensil/parsedUtensil.js', JSON.stringify(transformedDishes), () => {
  console.log('fone');
});

// .reduce((a, b) => {
//   return {
//     ...a,
//     [b.recipeId]: {
//       ...b,
//       Utensil: a[b.recipeId]?.Utensil
//         ? [...a[b.recipeId]?.Utensil, b.ingredientId]
//         : b.ingredientId
//         ? [b.ingredientId]
//         : [],
//     },
//   };
// }, {});

