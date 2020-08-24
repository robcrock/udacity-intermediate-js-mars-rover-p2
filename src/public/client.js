/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const store = {
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  tab: '', // w
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  console.log(store);
  render(root, store);
};

// const curiosityClickHandler = () => {
//   console.log('clicked');
//   // render(root, store);
// }

// W3Schools tab reference:
// https://www.w3schools.com/howto/howto_js_full_page_tabs.asp

function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  let i;

  const tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Remove the background color of all tablinks/buttons
  const tablinks = document.getElementsByClassName('tablink');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = '';
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = 'block';
  document.getElementById(pageName).style.backgroundColor = color;

  // Add the specific color to the button used to open the tab content
  // console.log(elmnt);
  elmnt.style.backgroundColor = color;
}

const render = async (root, state) => {
  root.innerHTML = App(state);

  // Get the element with id="defaultOpen" and click on it
  document.getElementById('defaultOpen').click();

};

const getRoverData = state => {
  const rover = state;
  fetch(`http://localhost:3000/rover/${rover}`)
    .then(res => res.json())
    .then(r => {
      // console.log(r);
      updateStore(store, { r });
    });
};

let called = false;
const RoverData = rover => {
  if (!called) {
    called = true;
    getRoverData(rover);
    return `
      <h1>Curiosity</h1>
      <img src="${store.r.url}" height="350px" width="100%" />
      <ul>
        <li>See today's featured video ${store.r.launch_date}</li>
        <li>See today's featured video ${store.r.landing_date}</li>
        <li>See today's featured video ${store.r.status}</li>
      </ul>
      `;
  }
};

{
  /* <header>
<button id='curiosity'>Curiosity</button>
</header>
<main>
  ${RoverData(rovers[0])}
</main>
<footer></footer> */
}

// create content
const App = state => {
  const { rovers, apod } = state;
  return `
    <button class="tablink" onclick="openPage('pod', this, 'red')" id="defaultOpen">Picture of the Day</button>
    <button class="tablink" onclick="openPage('curiosity', this, 'green')">Curiosity</button>
    <button class="tablink" onclick="openPage('opportunity', this, 'blue')">Opportunity</button>
    <button class="tablink" onclick="openPage('spirit', this, 'orange')">Spirit</button>

    <div id="pod" class="tabcontent">
      <h3>Home</h3>
      <p>Home is where the heart is..</p>
    </div>

    <div id="curiosity" class="tabcontent">
      <h3>News</h3>
      <p>Some news this fine day!</p>
    </div>

    <div id="opportunity" class="tabcontent">
      <h3>Contact</h3>
      <p>Get in touch, or swing by for a cup of coffee.</p>
    </div>

    <div id="spirit" class="tabcontent">
      <h3>About</h3>
      <p>Who we are and what we do.</p>
    </div>
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
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
            <!-- <p>See today's featured video <a href="${apod.url}">here</a></p> -->
            <!-- <p>${apod.title}</p> -->
            <!-- <p>${apod.explanation}</p> -->
        `;
  }
  return `
            <!-- <img src="${apod.image.url}" height="350px" width="100%" /> -->
            <!-- <p>${apod.image.explanation}</p> -->
        `;
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = state => {
  const { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      // console.log(apod);
      updateStore(store, { apod });
    });
};
