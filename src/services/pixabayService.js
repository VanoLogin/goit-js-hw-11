import axios from 'axios';

const BASE_URL = `https://pixabay.com`;
const API_KEY = '42128830-dc9c3845b3d280824a8228556';

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = {};
axios.defaults.params['key'] = API_KEY;

function getPictures({ queryValue, page = 1, perPage }) {
  return axios.get('/api/', {
    params: {
      q: queryValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });
}

export { getPictures };
