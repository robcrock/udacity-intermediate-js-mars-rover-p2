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

const render = async (root, state) => {
  root.innerHTML = App(state);

  // const curiosityButton = document.querySelector('#curiosity');
  // if (curiosityButton) {
  //   curiosityButton.addEventListener('click', curiosityClickHandler);
  // }
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

const RoverData = rover => {
  getRoverData(rover);
  return `<p>See today's featured video ${store.r}</p>`

// // Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = apod => {

//   // console.log(photodate.getDate() === today.getDate());
//   if (!apod || apod.date === today.getDate()) {
//     getImageOfTheDay(store);
//   }

//   // check if the photo of the day is actually type video!
//   if (apod.media_type === 'video') {
//     return `
//             <!-- <p>See today's featured video <a href="${apod.url}">here</a></p> -->
//             <!-- <p>${apod.title}</p> -->
//             <!-- <p>${apod.explanation}</p> -->
//         `;
//   }
//   return `
//             <!-- <img src="${apod.image.url}" height="350px" width="100%" /> -->
//             <!-- <p>${apod.image.explanation}</p> -->
//         `;
// };
};

// create content
const App = state => {
  const { rovers, apod } = state;

  // Add to template literal for potential testing
  // {ImageOfTheDay(apod)}

  return `
        <header>
          <button id='curiosity'>Curiosity</button>
        </header>
        <main>
            ${RoverData(rovers[0])}
        </main>
        <footer></footer>
    `;

};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
// TODO
// Create a tabbed nav for each rover in the store

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

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
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      // console.log(apod);
      updateStore(store, { apod });
    });
};
