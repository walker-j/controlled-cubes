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
						min={1}
						max={10}
						stepSize={0.1}
						labelStepSize={9}
						onChange={this.props.onValueChange}
						value={this.props.value}
					/>
				</div>
				{/* <Slider
                    min={0}
                    max={10}
                    stepSize={0.1}
                    labelStepSize={10}
                    onChange={this.getChangeHandler("value2")}
                    value={this.state.value2}
                    vertical={vertical}
                /> */}
				<Icon
					icon="symbol-square"
					iconSize={40}
				/>
				<Button
					icon="refresh"
					minimal={true}
					onClick={this.props.onResetValue}
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
					<span>ID : 1234vgdf5t </span>
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
				<SizeControls
					value={this.props.cubeSize}
					onValueChange={this.props.onCubeSizeChange}
					onResetValue={this.props.onResetCubeSize}
				/>
				<ActiveObjectControls />
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.idCounter = 0;
		this.defaultCubeSize = 2;

		this.state = {
			cameraAtDefault: true,
			cubes: [
				this.generateCube(),
				this.generateCube(),
			],
			cubeSize: this.defaultCubeSize
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

	handleCubeSizeChange(size) {
		this.setState({
			cubeSize: size
		});
	}

	handleResetCamera() {
		// this.setState({
		// 	resetCamera: true
		// });
	}

	handleResetCubeSize() {
		this.setState({
			cubeSize: this.defaultCubeSize
		});
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
					cubeSize={this.state.cubeSize}
					onCubeSizeChange={(size) => { this.handleCubeSizeChange(size); }}
					onAddCube={() => { this.handleAddCube(); }}
					onResetCamera={() => { this.handleResetCamera(); }}
					onResetCubeSize={() => { this.handleResetCubeSize(); }}
				/>
				{/* <Scene
					cubes={this.state.cubes}
					onCameraDidReset={() => { this.handleCameraDidReset(); }}
					resetCamera={this.state.resetCamera}
				/> */}
				<div className="scene-container">
					<Scene
						cameraAtDefault={this.state.cameraAtDefault}
						cubes={this.state.cubes}
						cubeSize={this.state.cubeSize}
					/>
				</div>
			</div>
		);
	}
}

export default App;
