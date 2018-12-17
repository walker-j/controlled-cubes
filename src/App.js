import React, { Component } from 'react';
import './App.css';

import { Button, Icon, Slider } from "@blueprintjs/core";

// import { ChromePicker } from 'react-color';

class BasicControls extends React.Component {
	render() {
		return (
			<div className="controls-row">
				<Button
					icon="plus"
					large={true}
				/>
				<span className="primary-text ellipsed-text">0 cubes in scene</span>
				<Button
					icon="refresh"
					minimal={true}
				/>
			</div>
		);
	}
}

class SizeControls extends React.Component {
	render() {
		return (
			<div className="controls-row">
				<Icon
					icon="symbol-square"
					iconSize={17}
				/>
				<div className="slider-container">
					<Slider
						min={0}
						max={10}
						stepSize={0.1}
						labelStepSize={10}
					/>
				</div>
				<Icon
					icon="symbol-square"
					iconSize={40}
				/>
				<Button
					icon="refresh"
					minimal={true}
				/>
			</div>
		);
	}
}

class ActiveObjectControls extends React.Component {
	render() {
		return (
			<div className="active-obj-controls">
				<div className="controls-row">
					<span className="primary-text ellipsed-text"> Active Cube
					</span>
					<span> 1234vgdf5t </span>
				</div>
				<div className="controls-row">
					{/* TODO ensure the color-button is distinguishable from the sizing slider icons */}
					<Button
						className="color-button"
					/>
					<Button
						icon="trash"
						intent="danger"
						minimal={true}
					/>
				</div>
				{/* <ChromePicker /> */}
			</div>
		);
	}
}

class SceneControls extends React.Component {
	render() {
		return (
			<div className="scene-controls">
				<BasicControls />
				<SizeControls />
				<ActiveObjectControls />
			</div>
		);
	}
}

class Scene extends React.Component {
	render() {
		return (
			<div className="scene">
				threejs scene placeholder
			</div>
		);
	}
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<SceneControls />
				<Scene />
			</div>
		);
	}
}

export default App;
