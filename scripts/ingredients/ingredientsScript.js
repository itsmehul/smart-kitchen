/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sjson = require('./ingredients.json');

// Use script to write json file from existing api data


transformedDishes = sjson.map(ing=>({
  id: ing.id,
  name: ing.name,
  type: ing.type?.toUpperCase().replace(' ', ''),
  diet: JSON.parse(ing.diet)?.toUpperCase().replace(' ', ''),
  fats: ing.fat,
  carbohydrates: ing.carbohydrates,
  proteins: ing.protein,
  calories: ing.totalCalories,
  allergens: ing.allergens
    ? JSON.parse(ing.allergens)?.map((allergen) => {
        if (allergen?.name) {
          return allergen?.name?.toUpperCase().replace(' ', '');
        }
        if (typeof allergen === 'string') {
          return allergen?.toUpperCase()?.replace(' ', '');
        }
        return;
      })
    : [],

}))

// .reduce((a,b) => ({
//   ...a,
//   [b.name]: b.id
// }),{});

fs.writeFile('parsedIngredients.json', JSON.stringify(transformedDishes), () => {
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

