/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sjson = require('./subrecipes.json');
const mappedIngredients = require('../ingredients/mappedIngredients.json');
const mappedSubrecipes = require('./mappedSubrecipes.json');

// Use script to write json file from existing api data

let x = sjson
.reduce((a, b) => {
  return {
    ...a,
    [b.id]: {
      ...b,
      ingredients: a[b.id]?.ingredients?[...a[b.id]?.ingredients, 
      {
        ...(b.ingredientId && {ingredient:{
          id:b.ingredientId
        }}), 
        ...(b.subRecipeId && {subRecipe:{
          id:b.subRecipeId
        }}),
        qty: b.amount}]
        :[{...(b.ingredientId && {ingredient:{
          id:b.ingredientId
        }}), 
        ...(b.subRecipeId && {subRecipe:{
          id:b.subRecipeId
        }}), qty: b.amount}],
      steps: a[b.id]?.steps
        ? [...a[b.id]?.steps, JSON.parse(b.instructions)[0]]
        : b.instructions
        ? [JSON.parse(b.instructions)[0]]
        : [],
    },
  };
}, {});


transformedDishes = Object.values(x).map(dish=>{
  let steps=[]
  count=1
  for(let step of dish.steps){
    if(!step?.instructions || step.instructions===" "){
      continue
    }
    
    steps.push({stepNo: count++,
    details: step?.instructions,
    ...(mappedIngredients[step.ingredientName] && {ingredient: step.ingredientName?{id:mappedIngredients[step.ingredientName]}:null}),
    ...(mappedSubrecipes[step.ingredientName] && {subRecipe: step.ingredientName?{id:mappedSubrecipes[step.ingredientName]}:null})})
  }
  return({
  id: dish.id,
  name: dish.variantName,
  category:{
    id: dish.categoryId,
    name: dish.categoryName,
  },
  
  cookbook:{
    name: `${dish.variantName} Cookbook`,
    steps:steps,
    recipeIngredients:dish.ingredients,
  },
})
})

// .reduce((a,b) => ({
//   ...a,
//   [b.name]: b.id
// }),{});

fs.writeFile('./subrecipes/parsedsubrecipes.js', JSON.stringify(transformedDishes), () => {
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

// id: ing.id,
//   name: ing.name,
//   type: ing.type?.toUpperCase().replace(' ', ''),
//   diet: JSON.parse(ing.diet)?.toUpperCase().replace(' ', ''),
//   fats: ing.fat,
//   carbohydrates: ing.carbohydrates,
//   proteins: ing.protein,
//   calories: ing.totalCalories,
//   allergens: ing.allergens
//     ? JSON.parse(ing.allergens)?.map((allergen) => {
//         if (allergen?.name) {
//           return allergen?.name?.toUpperCase().replace(' ', '');
//         }
//         if (typeof allergen === 'string') {
//           return allergen?.toUpperCase()?.replace(' ', '');
//         }
//         return;
//       })
//     : [],
