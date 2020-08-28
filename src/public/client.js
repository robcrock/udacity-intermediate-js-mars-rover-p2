/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const store = {
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  tab: '', // w
  pageName: '', //
  roverData: null,
  roverPhotos: [],
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  console.log(store);
  render(root, store);
};

// W3Schools tab reference:
// https://www.w3schools.com/howto/howto_js_full_page_tabs.asp
function openPage(pageName) {
  updateStore(store, { pageName });
}

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = state => {
  const { rovers, apod, pageName } = state;
  const activeRoverArr = rovers.filter(name => pageName === name.toLowerCase());
  return `
    <button class="tablink" onclick="ImageOfTheDay('apod')">Picture of the Day</button>
    <button class="tablink" onclick="openPage('curiosity')">Curiosity</button>
    <button class="tablink" onclick="openPage('spirit')">Spirit</button>
    <button class="tablink" onclick="openPage('opportunity')">Opportunity</button>

    ${activeRoverArr[0] ? RoverData(activeRoverArr[0].toLowerCase()) : ''}
  `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || photodate === today.getDate()) {
    getImageOfTheDay(store);
    console.log('Apod: , apod');
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
  // return `
      // <div id="pod" class="tabcontent">
      //     <img src="${apod.image.url}" height="350px" width="100%" />
      //     <p>${apod.image.explanation}</p>
      // </div>            
      //   `;
};

let called = null;
const RoverData = rover => {
  if (called !== rover) {
    called = rover;
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

// ------------------------------------------------------  API CALLS
const getImageOfTheDay = state => {
  const { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      updateStore(store, { apod });
    });
};

const getRoverData = rover => {
  fetch(`http://localhost:3000/rover`)
    .then(response => response.json())
    .then(r => {
      const roversByName = {
        // curiosity: {}
      };

      r.rovers.forEach(rover => {
        roversByName[rover.name.toLowerCase()] = rover;
      });
      const { max_date } = roversByName[rover];
      fetch(`http://localhost:3000/rover/${rover}/${max_date}`)
        .then(response => response.json())
        .then(roverPhotos => {
          updateStore(store, {
            roverData: roversByName[rover],
            roverPhotos: roverPhotos.photos.map(photo => photo.img_src),
          });
        });
    });
};

// ------------------------------------------------------  OTHER FUNCTIONS
function RoverImages(imgArray) {
  let output = '';
  imgArray.forEach(img => {
    output += `<img src="${img}" height="350px" width="100%" />`;
  });
  return output;
}
