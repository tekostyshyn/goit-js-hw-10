const BASE_URL = 'https://restcountries.com/v3.1/';
const ERROR = 'Oops, there is no country with that name';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        Notify.failure(ERROR, { fontSize: '20px', width: '400px' });
      }
      return response.json();
    })
    .then();
}
