import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fibonacci from "./Fibonacci";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>FIBONACCI CALCULATOR</h1>
          <br />
          <div className="link-container">
            <Link to="/" className="App-link">
              Home
            </Link>
            <Link to="/otherpage" className="App-link">
              Other page
            </Link>
          </div>
        </header>
        <div>
          <Route exact path="/" component={Fibonacci} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
