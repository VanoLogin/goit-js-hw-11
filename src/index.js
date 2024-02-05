import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import smoothScroll from './helper/smoothScroll.js';
import SimpleLightbox from 'simplelightbox';

import * as pixabayService from './services/pixabayService.js';
import appendCards from './templates/cardTemplate.js';
import buttonService from './services/loadMoreService.js';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

const queryParams = {
  page: 1,
  queryValue: '',
  perPage: 40,
};

const lightbox = new SimpleLightbox('.photo-card a');

refs.searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  refs.galleryContainer.innerHTML = '';
  buttonService.hide();
  queryParams.page = 1;
  queryParams.queryValue =
    event.currentTarget.elements.searchQuery.value.trim();

  fetchPictures()
    .then(data => {
      if (!data) {
        throw new Error('no data');
      }
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      buttonService.show();
      refs.loadBtn.addEventListener('click', handleLoadMore);
    })
    .catch(err => console.log(err))
    .finally(() => {
      refs.searchForm.reset();
    });
}

function handleLoadMore() {
  buttonService.disable();
  queryParams.page += 1;

  fetchPictures().then(buttonService.enable);
}

async function fetchPictures() {
  try {
    const { data } = await pixabayService.getPictures(queryParams);
    const allPages = Math.ceil(data.totalHits / queryParams.perPage);
    console.log(allPages);
    console.log(data);
    if (data.hits.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    appendCards(data.hits, refs.galleryContainer);
    lightbox.refresh();

    if (data.totalHits <= queryParams.perPage) {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (queryParams.page >= allPages) {
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }

    return data;
  } catch (error) {
    Notify.failure(error.message);
    buttonService.hide();
    return false;
  }
}
