// /src/App.js
import React from "react";
import FileManager from "./components/FileManager";
import "./index.css";  

const App = () => {
  return (
    <div className="App">
      <div className="directory-box">
        <h1 className="file-directory-heading">File Directory</h1> 
      </div>
      <FileManager />
    </div>
  );
};

export default App;