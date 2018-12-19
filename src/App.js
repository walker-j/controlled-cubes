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
					disabled={this.props.isCameraDefault}
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
				<Icon
					icon="symbol-square"
					iconSize={40}
				/>
				<Button
					disabled={this.props.isDefaultValue}
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
						icon="tint"
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
					isCameraDefault={this.props.isCameraDefault}
				/>
				<SizeControls
					value={this.props.cubeSize}
					isDefaultValue={this.props.isCubeDefaultSize}
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
		this.defaultCameraPosition = new THREE.Vector3(10, 8, 15);

		this.state = {
			cameraPosition: this.defaultCameraPosition,
			cubes: [
				this.generateCube(),
				this.generateCube(),
			],
			cubeSize: this.defaultCubeSize,
			isCameraDefault: true,
			isCubeDefaultSize: true
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
		return '#' + this.randomRGBAsHex() + this.randomRGBAsHex() + this.randomRGBAsHex();
	}

	randomRGBAsHex() {
		let hex = Number(Math.floor(Math.random() * 256)).toString(16);
		return (hex.length < 2) ? "0" + hex : hex;
	}

	randomPosition() {
		return new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
	}

	handleCameraChange(position) {
		// Do we _need_ to update the cameraPosition state here? Are we just creating extra renders? 
		this.setState({
			cameraPosition: position.clone(),
			isCameraDefault: false
		});
	}

	handleCubeSizeChange(size) {
		this.setState({
			cubeSize: size,
			isCubeDefaultSize: (size === this.defaultCubeSize)
		});
	}

	handleResetCamera() {
		this.setState({
			cameraPosition: this.defaultCameraPosition.clone(),
			isCameraDefault: true
		});
	}

	handleResetCubeSize() {
		this.setState({
			cubeSize: this.defaultCubeSize,
			isCubeDefaultSize: true
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
					isCameraDefault={this.state.isCameraDefault}
					isCubeDefaultSize={this.state.isCubeDefaultSize}
					onCubeSizeChange={(size) => { this.handleCubeSizeChange(size); }}
					onAddCube={() => { this.handleAddCube(); }}
					onResetCamera={() => { this.handleResetCamera(); }}
					onResetCubeSize={() => { this.handleResetCubeSize(); }}
				/>
				<div className="scene-container">
					<Scene
						cameraPosition={this.state.cameraPosition}
						cubes={this.state.cubes}
						cubeSize={this.state.cubeSize}
						isCameraDefault={this.state.isCameraDefault}
						onCameraChange={(position) => { this.handleCameraChange(position); }}
					/>
				</div>
			</div>
		);
	}
}

export default App;
