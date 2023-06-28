import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel version 2.---

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupBtns(curPage + 1, 'next');

    // last page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupBtns(curPage - 1, 'prev');

    // other
    if (curPage < numPages)
      return (
        this._generateMarkupBtns(curPage - 1, 'prev') +
        this._generateMarkupBtns(curPage + 1, 'next')
      );

    // page 1 and No other pages
    return '';
  }

  _generateMarkupBtns(goto, pageType) {
    if (pageType === 'next') {
      return `
      <button data-goto="${goto}" class="btn--inline pagination__btn--${pageType}">
        <span>Page ${goto}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    }
    if (pageType === 'prev') {
      return `
      <button data-goto="${goto}" class="btn--inline pagination__btn--${pageType}">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${goto}</span>
      </button>`;
    }
  }
}

export default new paginationView();
