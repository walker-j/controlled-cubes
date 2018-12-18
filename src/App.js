import React, { Component } from 'react';
import './App.css';

import { Button, Icon, Slider } from "@blueprintjs/core";
import * as THREE from 'three'
import threeOrbitControls from 'three-orbit-controls';

var OrbitControls = threeOrbitControls(THREE);

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

class Scene extends Component {
	// Testing updating scene
	addCube() {
		var geometry = new THREE.CubeGeometry(2, 2, 2);
		var material = new THREE.MeshLambertMaterial({ color: 0x252525 });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 10) - 5));

		this.scene.add(mesh);
		this.renderScene();
	}

	componentDidMount() {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		// Renderer
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height);
		renderer.setClearColor(0x2d2d2d);

		// threejs scene
		const scene = new THREE.Scene();

		// Camera
		const camera = new THREE.PerspectiveCamera(
			45,
			width / height,
			1,
			500
		);
		(camera.positionCamera = () => {
			camera.position.set(10, 8, 15);
			camera.lookAt(0, 0, 0);
		})();

		const light = new THREE.PointLight(0xffffff);
		light.position.set(11, 13, 16);
		scene.add(light);

		// Axes
		const axes = new THREE.AxesHelper(7);
		scene.add(axes);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		// Add this only if there is no animation loop (requestAnimationFrame)
		controls.addEventListener('change', () => { this.renderScene(); });

		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshLambertMaterial({ color: 0x3299ff });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		// Storing threejs objects for class-wide use
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		this.material = material;
		this.cube = cube;

		// TODO move this up to be with renderer bits?
		this.container.appendChild(this.renderer.domElement);

		this.props.cubes.forEach(element => {
			this.addCube();
		});

		window.addEventListener('resize', () => { this.onWindowResize() }, false);

		// this.start()
		//setTimeout(() => {this.addCube();}, 1000);
		//setTimeout(() => {this.resetCamera();}, 1000);
		this.renderScene();
	}

	componentWillUnmount() {
		this.container.removeChild(this.renderer.domElement)
	}

	onWindowResize() {
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.renderScene();
	}

	renderScene() {
		this.renderer.render(this.scene, this.camera)
	}

	render() {
		console.log('SCENE RENDER');
		// TODO add a cube for every one in src (shouldnt respawn previously existing ones though)
		console.log(this.props.cubes);
		//this.detectDataChanges(this.props.cubes);
		console.log(this.scene);

		// this.props.cubes.forEach(element => {
		// 	//this.addCube();
		// });

		if (this.props.resetCamera) {
			this.resetCamera();
			this.props.onCameraDidReset();
		}

		return (
			<div className="scene"
				ref={(container) => { this.container = container }} />
		);
	}

	resetCamera() {
		this.camera.positionCamera();
		this.renderScene();
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cubes: ['#ffffff', '#ec3131'],
			resetCamera: false
		}
	}

	handleCameraDidReset() {
		this.setState({
			resetCamera: false
		});
	}

	handleResetCamera() {
		this.setState({
			resetCamera: true
		});
	}

	handleAddCube() {
		const cubes = this.state.cubes.slice();
		this.setState({
			cubes: cubes.concat(['#0000ff'])
		});


		//alert(cubes);
		// const current = history[history.length - 1];
		// const squares = current.squares.slice();
		// if (calculateWinner(squares) || squares[i]) {
		// 	return;
		// }
		// squares[i] = this.state.xIsNext ? 'X' : 'O';
		// this.setState({
		// 	history: history.concat([{
		// 		squares: squares
		// 	}]),
		// 	stepNumber: history.length,
		// 	xIsNext: !this.state.xIsNext
		// });
	}

	render() {
		return (
			<div className="App" >
				<SceneControls
					cubeCount={this.state.cubes.length}
					onAddCube={() => { this.handleAddCube(); }}
					onResetCamera={() => { this.handleResetCamera(); }} />
				<Scene
					cubes={this.state.cubes}
					onCameraDidReset={() => { this.handleCameraDidReset(); }}
					resetCamera={this.state.resetCamera}
				/>
			</div>
		);
	}
}

export default App;
