import HeaderComponent from "./components/HeaderComponent/Header";
import Song from "./components/SongComponent/Song";
import SongCreate from "./components/SongComponent/SongCreate";
import SongEdit from "./components/SongComponent/SongEdit";
import Playlist from "./components/SongComponent/MyPlaylist";
import Genre from "./components/GenreComponent/Genre";
import GenreCreate from "./components/GenreComponent/GenreCreate";
import GenreEdit from "./components/GenreComponent/GenreEdit";
import Musician from "./components/MusicianComponent/Musician";
import MusicianCreate from "./components/MusicianComponent/MusicianCreate";
import MusicianEdit from "./components/MusicianComponent/MusicianEdit";
import Singer from "./components/SingerComponent/Singer";
import SingerCreate from "./components/SingerComponent/SingerCreate";
import SingerEdit from "./components/SingerComponent/SingerEdit";
import SingerDetail from "./components/SingerComponent/SingerDetail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <HeaderComponent />
      <Switch>
        <Route exact path="/" component={Song} />
        <Route exact path="/home" component={Song} />
        <Route exact path="/song" component={Song} />
        <Route exact path="/song/create" component={SongCreate} />
        <Route exact path="/song/edit/:id" component={SongEdit} />
        <Route exact path="/playlist" component={Playlist} />

        <Route exact path="/genre" component={Genre} />
        <Route exact path="/genre/create" component={GenreCreate} />
        <Route exact path="/genre/edit/:id" component={GenreEdit} />

        <Route exact path="/musician" component={Musician} />
        <Route exact path="/musician/create" component={MusicianCreate} />
        <Route exact path="/musician/edit/:id" component={MusicianEdit} />

        <Route exact path="/singer" component={Singer} />
        <Route exact path="/singer/create" component={SingerCreate} />
        <Route exact path="/singer/edit/:id" component={SingerEdit} />
        <Route exact path="/singer/detail/:id" component={SingerDetail} />
      </Switch>
    </Router>
  );
}

export default App;
