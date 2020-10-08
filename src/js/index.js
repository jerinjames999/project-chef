import Search from './models/Search';
import List from './models/List';
import * as searchView from './views/searchView';
import * as RecipeView from './views/RecipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader}  from './views/base';
import Likes from './models/Likes';
//Global state of the app
/*
  Search object
  current recipe object
  shoping list object
  liked recipes
*/
const state = {};
/*
SEARCH CONTROLLER
*/
const controlSearch = async () => {
  // get the query from the view.
  

  const query = searchView.getInput();
  
  if(query){
    //New search object and add to the state
    state.search = new Search(query);
    
    //Prepare UI for results
    searchView.clearResults();
    searchView.clearInput();
    renderLoader(elements.searchRes);
    try{
    //Search for recipes
    await state.search.getResults();
    clearLoader();
    // render the results on UI
    searchView.renderResults(state.search.results);
    }catch(error){
      clearLoader();
      alert('Error occured...');
    }
  }
}
elements.searchform.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

/*
RECIPE CONTROLLER
*/
const controlRecipe = async () => {
  //Get the id from the url
  const id = window.location.hash.replace('#','');

  if(id){
    //prepare the UI for changes
    RecipeView.clearRecipe();
    renderLoader(elements.recipe);
    if(state.search) searchView.highlightSelected(id);
    //create new recipe object
    state.recipe = new Recipe(id);
    try{
    //get recipe data and parse ingredients
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    //render the recipe
    clearLoader();
    RecipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
    }
    catch(error){
      console.log(error);
      alert('Error Processing Recipe');
    }
  }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


/*
RECIPE CONTROLLER
*/
const controlList= () =>{
  // Create a new list if there is none yet
  if(!state.list) state.list = new List();
  //add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el =>{
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

//Handle delete and update list Item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //handle the delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    listView.deleteItem(id);
    //Handle the count update
  }else if (e.target.matches('.shopping__count-value')){
    const val =parseInt(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/*
Likes CONTROLLER
*/
//for Testing


const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  if(!state.likes.isLiked(currentID)){
    //Add like to the data
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add to the UI list
    likesView.renderLike(newLike);
  }else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore Liked recipes on page loads
window.addEventListener('load',() => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //Render the existing Likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    //Decrease button is clicked 
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      RecipeView.updateServingsIngredients(state.recipe);
    }
    
  }else if (e.target.matches('.btn-increase, .btn-increase *')){
    //Increase button is clicked
    state.recipe.updateServings('inc');
    RecipeView.updateServingsIngredients(state.recipe);
  }
  else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }
  else if (e.target.matches('.recipe__love, recipe__love *')){
    // Like controller
    controlLike();
  }
});
