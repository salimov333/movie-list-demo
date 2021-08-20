import './App.css';
import { useState, useEffect } from 'react' // HOOKS import

const log = console.log

const API_URL = "http://localhost:4000/movies"

function App() {
  // DATEN FIRST

  // Movies & Series data
  let [arrMovies, setMovies] = useState( [] ); // => DAS IST STATE !!!!!

  // initiale DATEN zu laden
  // AFTER first render
  useEffect( () => {
    
    // DATEN von API holen

    fetch(API_URL)
    .then(response => response.json())
    .then(moviesApi => {
      log( moviesApi )

      // arrMovies = movies => DONT DO THIS SHIT!!!
      setMovies( moviesApi ) // overwrite 

    })


  }, []) // = componentDidMount

  // DATA operations

  // ADD
  const addMovie = () => {
    console.log('Add movie called...');

    // RUFE POPUP AUF (einfaches Popup) => prompt
    // FRAGE MOVIE TITEL VON USER AB
    const movieTitleNew = prompt('Neuen Movie Titel, buddhy, jetzt hier: ');

    if (!movieTitleNew) return; // one movie titel nix los!

    // ERSTELLE NEUES MOVIE OBJEKT
    // { title: "Happy" }
    const movieNew = {
      title: movieTitleNew,
      //id: Date.now().toString() //=> 123564728191
    }; // string => objekt

    // API => STATE => DOM
    fetch(API_URL, {
      method: "POST", // create NEW item at API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( movieNew )
    })
    .then(response => response.json())
    // API CALL was SUCCESSFUL
    .then(movieNewApi => {
      
      log(movieNewApi);

      // FÜGE NEUES MOVIE OBJEKT DEM ARRAY HINZU
      const arrMoviesNew =  [...arrMovies, movieNew] // merge COPY des Original Array mit neuem Movie 
      setMovies( arrMoviesNew ) // state update => THIS triggers DOM update
    })


  };

  // EDIT
  const editMovie = (idToEdit) => {
    console.log(`Editing movie ${idToEdit}...`);

    // FINDE OBJEKT IM ARRAY MIT DIESER ID
    const movieFound = arrMovies.find((movie) => movie.id == idToEdit);

    // OBJEKT GEFUNDEN ? => TITEL UPDATEN
    if (!movieFound) return;

    // NIMM NEUEN TITEL VOM USER AUF
    const movieTitleNew = prompt('Gib mir den neuen Titel, man!', movieFound.title);

    if (!movieTitleNew) return; // ohne movie titel nix los!

    // { title: "<title", id: 12345 }

    // API updaten

    const apiUpdateURL = `${API_URL}/${idToEdit}`

    log( apiUpdateURL )

    // UPDATE CHAIN: => API => STATE => DOM 

    // UPDATE DATA IN API with PUT or PATCH
    fetch(apiUpdateURL, {
      method: "PUT",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify( { ...movieFound, title: movieTitleNew } )
    })
    .then(response => response.json())

    // API changes was successful!! => update STATE too => update DOM
    .then(movieUpdatedApi => {
      log( movieUpdatedApi )

      // UPDATE Movie in State
      const moviesUpdated = arrMovies.map(movie => {
        // movie to update found?
        return (movie.id === idToEdit) ? { ...movie, title: movieTitleNew } : movie
      })
  
      setMovies( moviesUpdated )
    })


  };

  // DELETE
  const deleteMovie = (idToDelete) => {
    console.log(`Deleting movie ${idToDelete}...`);

    fetch(`${API_URL}/${idToDelete}`, {
      method: "DELETE"
    }) // => http://localhost:4000/movies/:id 
    .then(response => response.json())
    // API CALL successful => update local state
    .then(movieDeletedApi => {
      log( movieDeletedApi )

      // Use filter method to delete items
      const arrMoviesKeep = arrMovies.filter((movie) => movie.id != idToDelete); // => item mit id "idToDelete" (=> 3) => filter mir das RAUS!
      // arrMovies = arrMoviesKeep; // overwrite original array
      setMovies( arrMoviesKeep ) // update STATE => that triggers DOM update

    })

  };

  // CONVERT ARRAY OF MOVIES TO JSX
  const jsxMovies = arrMovies.map((movie) => (
    // map function always returns the UPDATED object
      <li key={ movie.id }>
        <span>{ movie.title }</span>
        <div className="btn-actions">
          <button onClick={ () => editMovie(movie.id) }>&#x270E;</button>
          <button onClick={ () => deleteMovie(movie.id) } >X</button>
        </div>
      </li>
    )
  ); // map soll das FORMAT eines Arrays in ein anderes Format umwandeln

  // RENDERING => FILL DATA INTO HTML TEMPLATE
  // JSX ONLY => no functions!!!!
  return (
    <div className="App">
      <header className="App-header">
        <h2>My Movie List</h2>
        <ul id="movies">{ jsxMovies }</ul>
        <button id="btn-add" onClick={ addMovie }>
          ADD MOVIE
        </button>
      </header>
    </div>
  );
}

export default App;
