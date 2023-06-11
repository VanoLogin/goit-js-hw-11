import './css/styles.css';
import PixabayService from './pixabay';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import smoothScroll from './smoothScroll';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

const pixabayService = new PixabayService();

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadBtn.addEventListener('click', onLoadMoreBtn);

refs.loadBtn.classList.add('hidden');

function onSearchForm(evt) {
  evt.preventDefault();
  clearContainer();
  pixabayService.searchQuery = evt.currentTarget.elements.searchQuery.value;

  if (pixabayService.searchQuery === '') {
    refs.loadBtn.classList.add('hidden');
    Notify.failure(`Please, enter your request`);
    return;
  }
  refs.loadBtn.classList.remove('hidden');
  pixabayService.resetPage();

  pixabayService.axiosArticales().then(renderGallery);
}

function onLoadMoreBtn() {
  pixabayService.axiosArticales().then(renderGallery);
}

function renderGallery(data) {
  try {
    const allPages = Math.ceil(data.totalHits / pixabayService.per_page);
    console.log(pixabayService.page);
    console.log(allPages);
    const markupGallery = createGalleryCard(data.hits);
    pixabayService.incrementPage();
    if (data.totalHits === 0) {
      refs.loadBtn.classList.add('hidden');
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else if (pixabayService.page > allPages && data.hits.length < 40) {
      refs.loadBtn.classList.add('hidden');
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      Notify.info(`We're sorry, but you've reached the end of search results.`);

      clearContainer();
    } else if (pixabayService.page - 1 === 1 && data.hits.length > 1) {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
    }

    refs.galleryContainer.insertAdjacentHTML('beforeend', markupGallery);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
    });

    lightbox.refresh();

    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}

function createGalleryCard(hits) {
  console.log(hits);
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
 <a class=photo-card__link href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
}

function clearContainer() {
  refs.galleryContainer.innerHTML = ' ';
}
