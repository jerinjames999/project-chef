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
}