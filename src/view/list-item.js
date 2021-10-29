import dayjs from 'dayjs';

const createTripItemTemplate = (tripPoint) => {
  const {
    pointType,
    extraOptions,
    price,
    startTime,
    duration,
    endTime,
  } = tripPoint;
  const tripDate = dayjs(startTime).format('MMM D');
  const time1 = dayjs(startTime).format('H:mm');
  const time2 = dayjs(endTime).format('H:mm');

  const getExtraOptionsList = (options) => {
    if (!options || Object.keys(options).length === 0) {
      return '';
    }
    return `
    <li class="event__offer">
      <span class="event__offer-title">${Object.keys(options)[0]}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${Object.values(options)[0]}</span>
    </li>`;
  };
  const extraOptionsTemplate = getExtraOptionsList(extraOptions);

  return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date">${tripDate}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${pointType}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time">${time1}</time>
              &mdash;
              <time class="event__end-time">${time2}</time>
            </p>
            <p class="event__duration">${duration} M</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${extraOptionsTemplate}
          </ul>
          <button class="event__favorite-btn event__favorite-btn--active" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
};

export default createTripItemTemplate;
