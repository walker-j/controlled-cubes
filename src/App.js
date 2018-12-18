import React, { Component } from 'react';
import './App.css';
import Scene from './Scene.js';
import { Button, Icon, Slider } from "@blueprintjs/core";
import * as THREE from 'three'

// import { ChromePicker } from 'react-color';

class BasicControls extends Component {
	render() {
		return (
			<div className="controls-row">
				<Button
					icon="plus"
					large={true}
					onClick={this.props.onAddCube}
				/>
				<span className="primary-text ellipsed-text">{this.props.cubeCount} cubes in scene</span>
				<Button
					icon="refresh"
					minimal={true}
					onClick={this.props.onResetCamera}
				/>
			</div>
		);
	}
}

class SizeControls extends Component {
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

class ActiveObjectControls extends Component {
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

class SceneControls extends Component {
	render() {
		return (
			<div className="scene-controls">
				<BasicControls
					cubeCount={this.props.cubeCount}
					onAddCube={this.props.onAddCube}
					onResetCamera={this.props.onResetCamera}
				/>
				<SizeControls />
				<ActiveObjectControls />
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.idCounter = 0;
		this.state = {
			cubes: [
				this.generateCube(),
				this.generateCube(),
			],
			resetCamera: false
		}
	}

	generateCube() {
		const cube = {
			color: this.randomColorHex(),
			id: this.idCounter,
			position: this.randomPosition()
		};
		this.idCounter++;
		return cube;
	}

	randomColorHex() {
		let r = '#' + this.randomRGBAsHex() + this.randomRGBAsHex() + this.randomRGBAsHex();
		console.log(r);
		return r; 
	}

	randomRGBAsHex() {
		let hex = Number(Math.floor(Math.random() * 256)).toString(16);
		return (hex.length < 2) ? "0" + hex : hex;
	}

	randomPosition() {
		return new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
	}

	handleCameraDidReset() {
		/*this.setState({
			resetCamera: false
		});*/
	}

	handleResetCamera() {
		// this.setState({
		// 	resetCamera: true
		// });
	}

	handleAddCube() {
		const cubes = this.state.cubes.slice();
		this.setState({
			cubes: cubes.concat([this.generateCube()])
		});
	}

	render() {
		return (
			<div className="App" ref={(container) => { this.container = container }}>
				<SceneControls
					cubeCount={this.state.cubes.length}
					onAddCube={() => { this.handleAddCube(); }}
					onResetCamera={() => { this.handleResetCamera(); }} />
				{/* <Scene
					cubes={this.state.cubes}
					onCameraDidReset={() => { this.handleCameraDidReset(); }}
					resetCamera={this.state.resetCamera}
				/> */}
				<div className="scene-container">
					<Scene
						cubes={this.state.cubes} 
						/>
				</div>
			</div>
		);
	}
}

export default App;
