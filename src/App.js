import React from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Main from "./components/main";
import DailyOrganizer from "./components/DailyOrganizer";
import "./App.css"; 



function App() {

  return (
    <div className="container">
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <Main />
        <DailyOrganizer /> 
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
