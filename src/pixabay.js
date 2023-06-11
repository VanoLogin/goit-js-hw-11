const BASE_URL = `https://pixabay.com`;

import axios from 'axios';
export default class PixabayService {
  constructor() {
    this.searchQueryEl = '';
    this.page = 1;
    this.per_page = 40;
  }

 
 async axiosArticales() {
    console.log(this);
    const url = `${BASE_URL}/api/?key=35701868-c3d58b65d5c3cc12148dfa145&q=${this.searchQueryEl}&language=en&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

   const response = await axios
     .get(url);
   return response.data;
          
    }
  
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get searchQuery() {
    return this.searchQueryEl;
  }
  set searchQuery(newQuery) {
    this.searchQueryEl = newQuery;
    }
    
}