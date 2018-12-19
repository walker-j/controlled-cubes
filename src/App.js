import React, { Component } from 'react';
import './App.css';
import Scene from './Scene.js';
import { Button, Icon, Popover, Slider, Classes, Intent, H5, Position } from "@blueprintjs/core";
import * as THREE from 'three'

import { ChromePicker } from 'react-color';

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
						min={0.2}
						max={10}
						stepSize={0.1}
						labelStepSize={9}
						labelRenderer={false}
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
		const id = this.props.selectedCubeId;

		return (
			<div className="active-obj-controls">
				<div className="controls-row">
					<span className="primary-text ellipsed-text"> Active Cube
					</span>
					<span><span className="primary-text">ID:</span> {id} </span>
				</div>
				<div className="controls-row">
					<Popover
						position={Position.BOTTOM_LEFT}>
						<Button
							icon="tint"
							intent={Intent.WARNING}
							className="color-button"
							style={{ backgroundColor: this.props.selectedCubeColor }}
						/>
						<div>
							<ChromePicker
								disableAlpha={true}
								color={this.props.selectedCubeColor}
								onChangeComplete={(color) => { this.props.onCubeColorChange(id, color); }} />
						</div>
					</Popover>
					<Popover
						position={Position.BOTTOM_RIGHT}>
						<Button
							icon="trash"
							intent={Intent.DANGER}
							minimal={true}
						/>
						<div
							key="text"
							className="popover-content">
							<H5>Confirm Deletion</H5>
							<p>Are you sure you want to delete this?</p>
							<div className="popover-buttons">
								<Button
									className={Classes.POPOVER_DISMISS}
									style={{ marginRight: 10 }}>
									Cancel
                    			</Button>
								<Button
									intent={Intent.DANGER}
									className={Classes.POPOVER_DISMISS}
									onClick={() => this.props.onRemoveCube(id)}>
									Delete
                    			</Button>
							</div>
						</div>
					</Popover>
				</div>
			</div>
		);
	}
}

class SceneControls extends Component {
	render() {
		const selectedCubeId = this.props.selectedCubeId;

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
				{selectedCubeId &&
					<ActiveObjectControls
						selectedCubeColor={this.props.selectedCubeColor}
						selectedCubeId={selectedCubeId}
						onCubeColorChange={this.props.onCubeColorChange}
						onRemoveCube={this.props.onRemoveCube}
					/>}

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

	randomColorHex() {
		return '#' + this.randomRGBAsHex() + this.randomRGBAsHex() + this.randomRGBAsHex();
	}

	randomRGBAsHex() {
		let hex = Number(Math.floor(Math.random() * 256)).toString(16);
		return (hex.length < 2) ? "0" + hex : hex;
	}

	randomPosition() {
		return new THREE.Vector3((Math.random() * 14) - 7, (Math.random() * 14) - 7, (Math.random() * 14) - 7);
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

	handleCubeSizeChange(size) {
		this.setState({
			cubeSize: size
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

	handleAddCube() {
		const cubes = this.state.cubes.slice();
		this.setState({
			cubes: cubes.concat([this.generateCube()])
		});
	}

	handleRemoveCube(id) {
		let cubes = [...this.state.cubes];
		console.log(cubes);
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
						selectedCubeId={this.state.selectedCubeId}
						onCameraChange={(position) => { this.handleCameraChange(position); }}
						onCubeHover={(id) => { this.handleCubeHover(id); }}
						onCubeSelect={(id) => { this.handleCubeSelect(id); }}
					/>
				</div>
			</div>
		);
	}
}

export default App;
