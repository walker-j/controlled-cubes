import React, { Component } from 'react';
import * as THREE from 'three'
import './App.css';
import Scene from './Scene.js';
import SceneControls from './SceneControls';

class App extends Component {
	constructor(props) {
		super(props);

		this.defaultCubeSize = 5.5;
		this.defaultCameraPosition = new THREE.Vector3(30, 24, 45);
		this.idCounter = 0;

		this.state = {
			cameraPosition: this.defaultCameraPosition,
			cubes: [],
			cubeSize: this.defaultCubeSize,
			hoveredCubeId: null,
			selectedCubeColor: '',
			selectedCubeId: null
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

	handleAddCube() {
		const cubes = this.state.cubes.slice();
		this.setState({
			cubes: cubes.concat([this.generateCube()])
		});
	}

	handleCameraChange(position) {
		this.setState({
			cameraPosition: position.clone()
		});
	}

	handleCubeColorChange(id, color) {
		let newArray = [...this.state.cubes];
		for (let i = 0; i < newArray.length; i++) {
			if (newArray[i].id.toString() === id) {
				newArray[i].color = color.hex;
				break;
			}
		}
		this.setState({
			cubes: newArray,
			selectedCubeColor: color.hex
		});
	}

	handleCubeHover(id) {
		if (id !== this.state.hoveredCubeId) {
			this.setState({
				hoveredCubeId: id
			});
		}
	}

	handleCubeSelect(id) {
		if (id !== this.state.selectedCubeId) {
			let selectedCubeColor;
			for (let i = 0; i < this.state.cubes.length; i++) {
				if (this.state.cubes[i].id.toString() === id) {
					selectedCubeColor = this.state.cubes[i].color;
					break;
				}
			}
			this.setState({
				selectedCubeId: id,
				selectedCubeColor: selectedCubeColor
			});
		}
	}

	handleCubeSizeChange(size) {
		this.setState({
			cubeSize: size
		});
	}

	handleRemoveCube(id) {
		let cubes = [...this.state.cubes];
		let indxToRemove;
		for (let i = 0; i < cubes.length; i++) {
			if (cubes[i].id.toString() === id) {
				indxToRemove = i;
				break;
			}
		}

		if (indxToRemove != null) {
			cubes.splice(indxToRemove, 1);
			this.setState({
				cubes: cubes,
				selectedCubeId: null
			});
		}
	}

	handleResetCamera() {
		this.setState({
			cameraPosition: this.defaultCameraPosition.clone()
		});
	}

	handleResetCubeSize() {
		this.setState({
			cubeSize: this.defaultCubeSize
		});
	}

	randomColorHex() {
		return '#' + this.randomRGBAsHex() + this.randomRGBAsHex() + this.randomRGBAsHex();
	}

	randomPosition() {
		return new THREE.Vector3((Math.random() * 40) - 20, (Math.random() * 40) - 20, (Math.random() * 40) - 20);
	}

	randomRGBAsHex() {
		let hex = Number(Math.floor(Math.random() * 256)).toString(16);
		return (hex.length < 2) ? "0" + hex : hex;
	}

	render() {
		return (
			<div className="App" ref={(container) => { this.container = container }}>
				<SceneControls
					cubeCount={this.state.cubes.length}
					cubeSize={this.state.cubeSize}
					isCameraDefault={this.state.cameraPosition.equals(this.defaultCameraPosition)}
					isCubeDefaultSize={(this.state.cubeSize === this.defaultCubeSize)}
					onAddCube={() => { this.handleAddCube(); }}
					onCubeColorChange={(id, color) => { this.handleCubeColorChange(id, color); }}
					onCubeSizeChange={(size) => { this.handleCubeSizeChange(size); }}
					onRemoveCube={(id) => { this.handleRemoveCube(id); }}
					onResetCamera={() => { this.handleResetCamera(); }}
					onResetCubeSize={() => { this.handleResetCubeSize(); }}
					selectedCubeColor={this.state.selectedCubeColor}
					selectedCubeId={this.state.selectedCubeId}
				/>
				<div className="scene-container">
					<Scene
						cameraPosition={this.state.cameraPosition}
						cubes={this.state.cubes}
						cubeSize={this.state.cubeSize}
						hoveredCubeId={this.state.hoveredCubeId}
						onCameraChange={(position) => { this.handleCameraChange(position); }}
						onCubeHover={(id) => { this.handleCubeHover(id); }}
						onCubeSelect={(id) => { this.handleCubeSelect(id); }}
						selectedCubeId={this.state.selectedCubeId}
					/>
				</div>
			</div>
		);
	}
}

export default App;
