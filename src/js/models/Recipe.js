import axios from 'axios';
import {apiurl} from '../config'
export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try{
            const res = await axios({
                "method":"GET",
                "url":apiurl + "recipes/"+this.id+"/information",
                "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key":process.env.API_KEY,
                "useQueryString":true
                }
                });
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.ingredients = res.data.extendedIngredients;
            this.readyInMinutes = res.data.readyInMinutes;
            this.servings = res.data.servings;
            this.pricePerServing = res.data.pricePerServing;
            this.likes = res.data.aggregateLikes;
            this.instructions = res.data.instructions;
                //console.log(res);
        }
        catch(error){
            console.log(error);
            alert('Something went wrong :(');
        }
    }
    parseIngredients(){
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            
            //Parse ingredients into count, unit and ingredients
            return {
                id: el.id,
                count: el.amount,
                unit: el.unit,
                ingredient: el.name,
                //image url =  https://spoonacular.com/cdn/ingredients_100x100/apple.jpg where dimention can be 100x100 or 250x250 or 500x500
                image: el.image,
                originalString: el.originalString
            };
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;
        
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/ this.servings);
        });
        this.servings = newServings;
    }
}
/*

Recipe {id: "559251", title: "Breakfast Pizza", author: "Jo Cooks", img: "https://spoonacular.com/recipeImages/559251-556x370.jpg", url: "http://www.jocooks.com/breakfast-2/breakfast-pizza/", …}
author: "Jo Cooks"
id: "559251"
img: "https://spoonacular.com/recipeImages/559251-556x370.jpg"
ingredients: (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
instructions: "<ul><li>Preheat oven to 500 F degrees.</li><li>Spray a baking sheet (15.25 x 10.25 inches) with cooking spray.</li><li>Roll out the pizza dough and place it on the pizza baking dish. Drizzle the dough with a bit of olive oil.</li><li>Arrange the mozzarella cheese evenly over the dough. Sprinkle with Parmesan cheese.</li><li>Top with bacon and tomato. Crack 6 eggs on the pizza.</li><li>Bake for 10 to 15 minutes or until the edge is golden brown.</li><li>Garnish with chives and parsley.</li></ul>"
likes: 4235
pricePerServing: 195.59
readyInMinutes: 25
servings: 6
title: "Breakfast Pizza"
url: "http://www.jocooks.com/breakfast-2/breakfast-pizza/"
*/
