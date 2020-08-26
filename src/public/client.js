/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const store = {
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  tab: '', // w
  r: null, // rover
  pageName: '', //
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

// const curiosityClickHandler = () => {
//   console.log('clicked');
//   // render(root, store);
// }

// W3Schools tab reference:
// https://www.w3schools.com/howto/howto_js_full_page_tabs.asp

function openPage(pageName, elmnt, color) {
  updateStore(store, { pageName });

  // // Hide all elements with class="tabcontent" by default */
  // let i;

  // const tabcontent = document.getElementsByClassName('tabcontent');
  // for (i = 0; i < tabcontent.length; i++) {
  //   tabcontent[i].style.display = 'none';
  // }

  // // Remove the background color of all tablinks/buttons
  // const tablinks = document.getElementsByClassName('tablink');
  // for (i = 0; i < tablinks.length; i++) {
  //   tablinks[i].style.backgroundColor = '';
  // }

  // // Show the specific tab content
  // document.getElementById(pageName).style.display = 'block';
  // document.getElementById(pageName).style.backgroundColor = color;

  // // Add the specific color to the button used to open the tab content
  // // console.log(elmnt);
  // elmnt.style.backgroundColor = color;

  // console.log(RoverData('curiosity'));
}

const render = async (root, state) => {
  root.innerHTML = App(state);

  // Get the element with id="defaultOpen" and click on it
  // document.getElementById('defaultOpen').click();
};

const getRoverData = rover => {
  // const rover = state;
  fetch(`http://localhost:3000/rover/${rover}`)
    .then(res => res.json())
    .then(r => {
      console.log(r);
      updateStore(store, { r });
    });
};

let called = null;
const RoverData = rover => {
  // console.log('ROVERDATA', rover, store.r);
  if (called !== rover) {
    // console.log('called', called, rover);
    called = rover;
    getRoverData(rover);
  }
  if (!store.r) {
    return `<h1>Loading...</h1>`;
  }
  return `
    <div class="tabcontent">
      <h1>${rover}</h1>
      <img src="${store.r.photos[0].img_src}" height="350px" width="100%" />
      <ul>
        <li>Launch date ${store.r.photos[0].rover.launch_date}</li>
        <li>Landing date  ${store.r.photos[0].rover.landing_date}</li>
        <li>Status ${store.r.photos[0].rover.status}</li>
      </ul>
    </div>
    `;
};

// create content
const App = state => {
  const { rovers, apod, pageName } = state;
  console.log(pageName);
  return `
    <button class="tablink" onclick="openPage('pod', this, 'red')" id="defaultOpen">Picture of the Day</button>
    <button class="tablink" onclick="openPage('curiosity', this, 'green')">Curiosity</button>
    <button class="tablink" onclick="openPage('opportunity', this, 'blue')">Opportunity</button>
    <button class="tablink" onclick="openPage('spirit', this, 'orange')">Spirit</button>

    ${pageName === 'pod' ? ImageOfTheDay(apod) : ''}

      ${
        pageName === rovers[0].toLowerCase()
          ? RoverData(rovers[0].toLowerCase())
          : ''
      }

      ${
        pageName === rovers[1].toLowerCase()
          ? RoverData(rovers[1].toLowerCase())
          : ''
      }

      ${
        pageName === rovers[2].toLowerCase()
          ? RoverData(rovers[2].toLowerCase())
          : ''
      }
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
// TODO
// Create a tabbed nav for each rover in the store

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  // console.log(photodate.getDate(), today.getDate());

  // console.log(photodate.getDate() === today.getDate());
  if (!apod || photodate === today.getDate()) {
    getImageOfTheDay(store);
  }

  console.log(apod.image.url);
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

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = state => {
  const { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      updateStore(store, { apod });
    });
};
