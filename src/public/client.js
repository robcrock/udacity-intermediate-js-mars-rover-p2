/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
const store = {
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  tab: '', // w
  pageName: 'pod', //
  roverData: null,
  roverPhotos: [],
};

const map = Immutable.Map(store);

const root = document.getElementById('root');

const render = async (rootParam, state) => {
  rootParam.innerHTML = App(state);
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, map);
});

// ------------------------------------------------------  UTIL FUNCTIONS BELOW
function RoverImages(imgArray) {
  const output = imgArray.map(
    img => `<img src="${img}" height="350px" width="100%" />`
  );
  return output;
}

const updateStore = (storeParam, newState) => {
  const newMap = storeParam.merge(newState);
  render(root, newMap);
};

// W3Schools tab reference:
// https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
function setPageName(pageName) {
  console.log('Page name ', pageName);
  map.set('pageName', pageName);
  console.log(map);
  // App(map);
}
// ------------------------------------------------------  UTIL FUNCTIONS ABOVE

// ------------------------------------------------------  API CALLS BELOW
const getImageOfTheDay = state => {
  const stateObj = state.toJS();
  const { apod } = stateObj;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      updateStore(map, { apod });
    });
};

const getRoverData = rover => {
  fetch(`http://localhost:3000/rover`)
    .then(response => response.json())
    .then(r => {
      const roversByName = {
        // curiosity: {}
      };

      r.rovers.forEach(roverPram => {
        roversByName[roverPram.name.toLowerCase()] = roverPram;
      });

      const { max_date: maxDate } = roversByName[rover];
      fetch(`http://localhost:3000/rover/${rover}/${maxDate}`)
        .then(response => response.json())
        .then(roverPhotos => {
          updateStore(map, {
            roverData: roversByName[rover],
            roverPhotos: roverPhotos.photos.map(photo => photo.img_src),
          });
        });
    });
};
// ------------------------------------------------------  API CALLS ABOVE

// ------------------------------------------------- COMPONENTS BELOW
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (
    (!apod || photodate === today.getDate()) &&
    !ImageOfTheDay._imagesRequested
  ) {
    ImageOfTheDay._imagesRequested = true;
    getImageOfTheDay(map);
  }

  if (!apod) {
    return `<h1>Loading...</h1>`;
  }
  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
      <div id="pod" class="tabcontent">
        <p>See today's featured video <a href="${apod.image.url}">here</a></p>
        <p>${apod.title}</p>
        <p>${apod.explanation}</p>
      </div>
      `;
  }
  return `
      <div id="pod" class="tabcontent">
          <img src="${apod.image.url}" height="350px" width="100%" />
          <p>${apod.image.explanation}</p>
      </div>            
      `;
};

const RoverData = rover => {
  if (RoverData._called !== rover) {
    RoverData._called = rover;
    getRoverData(rover);
  }
  if (!store.roverData || !store.roverPhotos.length) {
    return `<h1>Loading...</h1>`;
  }
  return `
    <div class="tabcontent">
      <h1>${store.roverData.name}</h1>
      <ul>
        <li>Launch date ${store.roverData.launch_date}</li>
        <li>Landing date  ${store.roverData.landing_date}</li>
        <li>Status ${store.roverData.status}</li>
        <li>Most recent photos taken on ${store.roverData.max_date}</li>
      </ul>
      ${RoverImages(store.roverPhotos)}
    </div>
    `;
};
// ------------------------------------------------- COMPONENTS ABOVE

// create content
const App = state => {
  const stateObj = state.toJS();
  const { rovers, apod, pageName } = stateObj;
  const activeRoverArr = rovers.filter(name => pageName === name.toLowerCase());
  console.log('Page name ', pageName);
  return `
    <button class="tablink" onclick="setPageName('pod')">Picture of the Day</button>
    <button class="tablink" onclick="setPageName('curiosity')">Curiosity</button>
    <button class="tablink" onclick="setPageName('spirit')">Spirit</button>
    <button class="tablink" onclick="setPageName('opportunity')">Opportunity</button>

    ${
      activeRoverArr[0]
        ? RoverData(activeRoverArr[0].toLowerCase())
        : ImageOfTheDay(apod)
    }
  `;
};
