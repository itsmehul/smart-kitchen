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
  unit: ing.unit,

  inventories:[{...ing.inventory[0], expiry: 
  new Date(new Date().getTime() + Math.random() * (new Date(2022, 2, 2).getTime() - new Date().getTime())),
  qty: Number((Math.floor(Math.random() * (10000 - 1000) + 1000)).toFixed(0)),
  pricePerUnit: Number((Math.random() * (0.1 - 0.005) + 0.005).toFixed(2)),
  

}]
}))

// .reduce((a,b) => ({
//   ...a,
//   [b.name]: b.id
// }),{});

fs.writeFile('./ingredients/parsedIngredients.js', JSON.stringify(transformedDishes), () => {
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

