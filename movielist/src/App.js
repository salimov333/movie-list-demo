import './App.css';
import { useState } from 'react'

function App() {
  // DATEN FIRST

  // Movies & Series data
  let [arrMovies, setMovies] = useState( [
    { title: 'Love Death & Robots', id: '1' },
    { title: 'Happy', id: '2' },
    { title: '3 Percent', id: '3' }
  ] ); // => DAS IST STATE !!!!!

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
      id: Date.now().toString() //=> 123564728191
    }; // string => objekt

    console.log(movieNew);

    // FÜGE NEUES MOVIE OBJEKT DEM ARRAY HINZU
    
    // arrMovies.push( movieNew ); => DIREKTE Manipulation des Arrays triggert kein  
    
    const arrMoviesNew =  [...arrMovies, movieNew] // merge COPY des Original Array mit neuem Movie 
    setMovies( arrMoviesNew ) // state update => THIS triggers DOM update

    console.log(arrMovies);
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

    if (!movieTitleNew) return; // one movie titel nix los!

    movieFound.title = movieTitleNew;
  };

  // DELETE
  const deleteMovie = (idToDelete) => {
    console.log(`Deleting movie ${idToDelete}...`);

    // Method 1: Find object in array by index & splice it away!
    // arrMovies.findIndex()
    // arrMovies.splice()

    // Method 2: Use filter method to delete items
    const arrMoviesKeep = arrMovies.filter((movie) => movie.id != idToDelete); // => item mit id "idToDelete" (=> 3) => filter mir das RAUS!

    console.log(arrMoviesKeep);

    // arrMovies = arrMoviesKeep; // overwrite original array
    setMovies( arrMoviesKeep ) // update STATE => that triggers DOM update
  };

  // CONVERT ARRAY OF MOVIES TO JSX
  const jsxMovies = arrMovies.map((movie) => (
    // map function always returns the UPDATED object
      <li>
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
        <ul id="movies">{jsxMovies}</ul>
        <button id="btn-add" onClick={ addMovie }>
          ADD MOVIE
        </button>
      </header>
    </div>
  );
}

export default App;
