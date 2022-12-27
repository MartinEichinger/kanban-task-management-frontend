import { Directus } from '@directus/sdk';

//console.log('directus.js: ', process.env.REACT_APP_DIRECTUS_URL);
export const directus = new Directus(process.env.REACT_APP_DIRECTUS_URL);
