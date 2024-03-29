// import logo from './logo.svg';
import "./App.css";
import { AppContextProvider } from "./providers";
import { NavFrame, Router } from "./components";

function App() {
  return (
    <AppContextProvider>
      <NavFrame>
        <Router />
      </NavFrame>
    </AppContextProvider>
  );
}

export default App;
