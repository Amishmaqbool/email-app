import logo from "./logo.svg";
import "./App.css";
import Layout from "./components/layout.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./store/rootReducer";
import store from "./store/store"

function App() {
  return (
    <>
      {/* <Layout /> */}
      <Provider store={store}>
        <Layout />
      </Provider>
      ,
    </>
  );
}

export default App;
