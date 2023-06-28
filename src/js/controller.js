import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import seacrhView from './views/seacrhView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) update the search results to mark selected
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // recipeView.renderError(model.state.search);
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get query
    const query = seacrhView.getQuery();
    if (!query) return;

    // 2) load search result
    await model.loadSearchResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    // 4) render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

const controlPagination = function (goToPage) {
  // 3) render NEW results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) render NEW pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // update state
  model.updateServings(newServings);
  // render recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddUpload = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();
    // upload recipe
    await model.uploadRecipe(newRecipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    // render bookmarks
    bookmarksView.render(model.state.bookmarks);
    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close windiw form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error('🚨🚨🚨', err);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  seacrhView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddUpload);
};
init();
