import './App.css';
import { Component } from 'react' // HOOKS import

const log = console.log // ALIAS for that way to long "console.log" :)

const API_URL = "http://localhost:4000/movies"

class App extends Component {
  // DATEN FIRST

  // Movies & Series data
  state = {
    arrMovies: []
  }

  // AFTER first render
  // initiale DATEN laden
  componentDidMount() {
    
    // DATEN von API holen

    fetch(API_URL)
    .then(response => response.json())
    .then(moviesApi => {

      log( moviesApi )
      this.setState( { arrMovies: moviesApi } ) // overwrite 

    })

  }

  // DATA operations

  // ADD
  addMovie = () => {
    console.log('Add movie called...');

    // RUFE POPUP AUF (einfaches Popup) => prompt
    // FRAGE MOVIE TITEL VON USER AB
    const movieTitleNew = prompt('Neuen Movie Titel, buddhy, jetzt hier: ');

    if (!movieTitleNew) return; // one movie titel nix los!

    // ERSTELLE NEUES MOVIE OBJEKT
    const movieNew = {
      title: movieTitleNew,
    };

    // Sende neuen Movie an API!
    fetch(API_URL, {
      method: "POST", // POST = create NEW item at API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( movieNew )
    })
    .then(response => response.json())
    // API CALL was SUCCESSFUL
    .then(movieNewApi => {
      
      log(movieNewApi); // this is what the API created... it will have an ID!

      // FÜGE NEUES MOVIE OBJEKT DEM ARRAY HINZU
      const arrMoviesNew =  [...this.state.arrMovies, movieNewApi] // merge COPY des Original Array mit neuem Movie 
      this.setState( { arrMovies: arrMoviesNew } ) // state update => THIS triggers DOM update
    })


  };

  // EDIT
  editMovie = (idToEdit) => {
    console.log(`Editing movie ${idToEdit}...`);

    // FINDE OBJEKT IM ARRAY MIT DIESER ID
    const movieFound = this.state.arrMovies.find((movie) => movie.id == idToEdit);

    // OBJEKT GEFUNDEN ? => TITEL UPDATEN
    if (!movieFound) return;

    // NIMM NEUEN TITEL VOM USER AUF
    const movieTitleNew = prompt('Gib mir den neuen Titel, man!', movieFound.title);

    if (!movieTitleNew) return; // ohne movie titel nix los!

    // API update URL => ID anhängen!
    const apiUpdateURL = `${API_URL}/${idToEdit}`
    log( apiUpdateURL )

    // UPDATE CHAIN: => API CALL => API RESPONSE WITH DATA => STATE UPDATE => DOM UPDATE 

    // UPDATE DATA IN API with PUT or PATCH
    fetch(apiUpdateURL, {
      method: "PUT",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify( { ...movieFound, title: movieTitleNew } )
    })
    .then(response => response.json())

    // API changes was successful!! => update STATE too
    .then(movieUpdatedApi => {
      log( movieUpdatedApi )

      // UPDATE Movie in State
      const moviesUpdated = this.state.arrMovies.map(movie => {
        // movie to update found?
        return (movie.id === idToEdit) ? { ...movie, title: movieTitleNew } : movie
      })
  
      this.setState( { arrMovies: moviesUpdated } )
    })


  };

  // DELETE
  deleteMovie = (idToDelete) => {
    console.log(`Deleting movie ${idToDelete}...`);

    fetch(`${API_URL}/${idToDelete}`, {
      method: "DELETE"
    }) // => URL: http://localhost:4000/movies/:id 
    .then(response => response.json())
    // API CALL successful => update local state
    .then(movieDeletedApi => {
      
      log( movieDeletedApi )

      // Use filter method to delete item
      const arrMoviesKeep = this.state.arrMovies.filter((movie) => movie.id != idToDelete); // => item mit id "idToDelete" (=> 3) => filter mir das RAUS!
      this.setState( { arrMovies: arrMoviesKeep } ) // update STATE => that triggers DOM update

    })

  };

  render() {

    // CONVERT ARRAY OF MOVIES TO JSX
    const jsxMovies = this.state.arrMovies.map((movie) => (
      // map function always returns the UPDATED object
        <li key={ movie.id }>
          <span>{ movie.title }</span>
          <div className="btn-actions">
            <button onClick={ () => this.editMovie(movie.id) }>&#x270E;</button>
            <button onClick={ () => this.deleteMovie(movie.id) } >X</button>
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
          <button id="btn-add" onClick={ this.addMovie }>
            ADD MOVIE
          </button>
        </header>
      </div>
    );

  }

}

export default App;
