import "./App.scss";
import HomeView from "./views/Home";

const App = () => {
  return (
    <>
      <HomeView />
      <div className="overlay" />
      <div className="overlay glitch" />
    </>
  );
};

export default App;
