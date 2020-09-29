import Search from './models/Search'
import * as searchView from './views/searchView'
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader}  from './views/base'
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
    //Search for recipes
    await state.search.getResults();
    clearLoader();
    // render the results on UI
    searchView.renderResults(state.search.results);
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
const r = new Recipe(559251);
r.getRecipe();
console.log(r);