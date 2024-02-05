const loadBtn = document.querySelector('.load-more');

const hiddenClass = 'hidden';
function show() {
  loadBtn.classList.remove(hiddenClass);
}

function disable() {
  loadBtn.disabled = true;
  loadBtn.textContent = 'Loading...';
}
function hide() {
  loadBtn.classList.add(hiddenClass);
}

function enable() {
  loadBtn.disabled = false;
  loadBtn.textContent = 'Load more';
}

export default {show, hide, disable, enable}
