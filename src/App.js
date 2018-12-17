import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Button, Slider } from "@blueprintjs/core";
import { ChromePicker } from 'react-color';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button>Test button</button>
          <Button 
            intent="primary" 
            text="button content"
            onClick={alert}
          />
          <Slider
                    min={0}
                    max={10}
                    stepSize={0.1}
                    labelStepSize={10}
                />
          {/* <ChromePicker /> */}
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
