import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const WARNING_MESSAGE =
  'Too many matches found. Please enter a more specific name.';
const ERROR = 'Oops, there is no country with that name';
const refs = {
  input: document.querySelector('input#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryBox: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onTextFieldInput, DEBOUNCE_DELAY)
);

function onTextFieldInput() {
  const trimmedInputValue = refs.input.value.trim();
  if (trimmedInputValue) {
    fetchCountries(trimmedInputValue)
      .then(checkFetchedData)
      .catch(() => {
        Notify.failure(ERROR, { fontSize: '20px', width: '400px' });
        clearBoxMarkup();
        clearListMarkup();
      });
  }
}

function checkFetchedData(countries) {
  if (countries.length > 10) {
    Notify.info(WARNING_MESSAGE, { fontSize: '20px', width: '400px' });
    clearBoxMarkup();
    clearListMarkup();
  } else if (countries.length >= 2 && countries.length <= 10) {
    clearBoxMarkup();
    createListMarkup(countries);
  } else if (countries.length === 1) {
    clearListMarkup();
    createBoxMarkup(countries);
  }
}

function createListMarkup(countries) {
  refs.countriesList.innerHTML = countries
    .map(
      country =>
        `<li class='country-list__item'>
        <img class='country-list__flag' src=${country.flags.svg} alt='flag of ${country.name.official}'>
        <p class='country-list__name'>${country.name.official}</p></li>`
    )
    .join('');
}

function createBoxMarkup(countries) {
  refs.countryBox.innerHTML = countries
    .map(country => {
      const countryLanguage = Object.values(country.languages).join(', ');

      return `<div class='country-info__box'>
      <img class='country-info__flag' src=${country.flags.svg} alt='flag of ${country.name.official}'>
      <p class='country-info__title'>${country.name.official}<p>
      </div>
      <p class='country-info__content'><b>Capital:</b> ${country.capital}</p>
      <p class='country-info__content'><b>Population:</b> ${country.population}</p>
      <p class='country-info__content'><b>Languages:</b> ${countryLanguage}</p>`;
    })
    .join('');
}

function clearListMarkup() {
  refs.countriesList.innerHTML = '';
}

function clearBoxMarkup() {
  refs.countryBox.innerHTML = '';
}
