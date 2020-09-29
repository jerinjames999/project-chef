const axios = require("axios");
import {apiurl} from '../config'
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        try{
          console.log('hello');
          console.log(process.env)
        const res = await axios({
            "method":"GET",
            "url": apiurl + "recipes/search/",
            "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key":process.env.API_KEY,
            "useQueryString":true
            },"params":{
            "number":"30",
            "offset":"0",
            "type":"main course",
            "query":this.query
            }
            });
        this.results = res.data.results;
        //console.log(this.results);
        }
        catch(error){
          alert(error);
        }
      }
}