// Main JS for Recipe Finder using TheMealDB API
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealsContainer = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const errorContainer = document.getElementById('error-container');
const mealDetails = document.getElementById('meal-details');
const mealDetailsContent = document.querySelector('.meal-details-content');
const backBtn = document.getElementById('back-btn');

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

// Event listeners
searchBtn.addEventListener('click', searchMeals);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchMeals();
});
mealsContainer.addEventListener('click', handleMealClick);
mealsContainer.addEventListener('keydown', (e) => {
  // support keyboard selection on cards (Enter / Space)
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.meal')) {
    handleMealClick({ target: e.target });
  }
});
backBtn.addEventListener('click', hideDetails);

// Search meals by name / keyword
async function searchMeals() {
  const searchTerm = searchInput.value.trim();

  // clear previous UI
  resultHeading.textContent = '';
  mealsContainer.innerHTML = '';
  errorContainer.classList.add('hidden');

  if (!searchTerm) {
    errorContainer.textContent = 'Please enter a search term';
    errorContainer.classList.remove('hidden');
    return;
  }

  resultHeading.textContent = `Searching for "${searchTerm}"...`;

  try {
    const resp = await fetch(`${SEARCH_URL}${encodeURIComponent(searchTerm)}`);
    if (!resp.ok) throw new Error('Network response was not ok');
    const data = await resp.json();

    if (!data.meals) {
      resultHeading.textContent = '';
      errorContainer.textContent = `No recipes found for "${searchTerm}". Try another search term!`;
      errorContainer.classList.remove('hidden');
      return;
    }

    resultHeading.textContent = `Search results for "${searchTerm}":`;
    displayMeals(data.meals);
    searchInput.value = '';
  } catch (err) {
    resultHeading.textContent = '';
    errorContainer.textContent = 'Something went wrong. Please try again later.';
    errorContainer.classList.remove('hidden');
    console.error(err);
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = '';

  meals.forEach(meal => {
    const card = document.createElement('article');
    card.className = 'meal';
    card.setAttribute('data-meal-id', meal.idMeal);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    const img = document.createElement('img');
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const info = document.createElement('div');
    info.className = 'meal-info';

    const title = document.createElement('h3');
    title.className = 'meal-title';
    title.textContent = meal.strMeal;

    info.appendChild(title);

    if (meal.strCategory) {
      const cat = document.createElement('div');
      cat.className = 'meal-category';
      cat.textContent = meal.strCategory;
      info.appendChild(cat);
    }

    card.appendChild(img);
    card.appendChild(info);

    mealsContainer.appendChild(card);
  });
}

// handle click on a meal to show details
async function handleMealClick(e) {
  const mealEl = e.target.closest('.meal');
  if (!mealEl) return;

  const mealId = mealEl.getAttribute('data-meal-id');
  if (!mealId) return;

  try {
    const resp = await fetch(`${LOOKUP_URL}${mealId}`);
    if (!resp.ok) throw new Error('Network response was not ok');
    const data = await resp.json();
    const meal = data.meals && data.meals[0];
    if (!meal) {
      errorContainer.textContent = 'Could not load recipe details. Please try again later.';
      errorContainer.classList.remove('hidden');
      return;
    }

    // build ingredients list
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient: ingredient.trim(), measure: (measure || '').trim() });
      }
    }

    // render details
    mealDetailsContent.innerHTML = '';

    const img = document.createElement('img');
    img.className = 'meal-details-img';
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const title = document.createElement('h2');
    title.className = 'meal-details-title';
    title.textContent = meal.strMeal;

    const categoryWrap = document.createElement('div');
    categoryWrap.className = 'meal-details-category';
    const span = document.createElement('span');
    span.textContent = meal.strCategory || 'Uncategorized';
    categoryWrap.appendChild(span);

    const instructionsWrap = document.createElement('div');
    instructionsWrap.className = 'meal-details-instructions';
    const instrH3 = document.createElement('h3');
    instrH3.textContent = 'Instructions';
    const instrP = document.createElement('p');
    instrP.textContent = meal.strInstructions || '';
    instructionsWrap.appendChild(instrH3);
    instructionsWrap.appendChild(instrP);

    const ingredientsWrap = document.createElement('div');
    ingredientsWrap.className = 'meal-details-ingredients';
    const ingrH3 = document.createElement('h3');
    ingrH3.textContent = 'Ingredients';
    const ul = document.createElement('ul');
    ul.className = 'ingredients-list';
    ingredients.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}`;
      ul.appendChild(li);
    });
    ingredientsWrap.appendChild(ingrH3);
    ingredientsWrap.appendChild(ul);

    mealDetailsContent.appendChild(img);
    mealDetailsContent.appendChild(title);
    mealDetailsContent.appendChild(categoryWrap);
    mealDetailsContent.appendChild(instructionsWrap);
    mealDetailsContent.appendChild(ingredientsWrap);

    if (meal.strYoutube) {
      const a = document.createElement('a');
      a.href = meal.strYoutube;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'youtube-link';
      a.innerHTML = '<i class="fab fa-youtube"></i> Watch Video';
      mealDetailsContent.appendChild(a);
    }

    // show details
    mealDetails.classList.remove('hidden');
    mealDetails.setAttribute('aria-hidden', 'false');
    mealDetails.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    errorContainer.textContent = 'Could not load recipe details. Please try again later.';
    errorContainer.classList.remove('hidden');
    console.error(err);
  }
}

function hideDetails() {
  mealDetails.classList.add('hidden');
  mealDetails.setAttribute('aria-hidden', 'true');
  mealDetailsContent.innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}