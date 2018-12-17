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
				<BasicControls />
				<SizeControls />
				<ActiveObjectControls />
			</div>
		);
	}
}

class Scene extends Component {
	// Testing updating scene
	addCube(){
		var geometry = new THREE.CubeGeometry( 1, 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0x252525 } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(new THREE.Vector3(1, 1, 1));

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
		camera.position.set(10, 8, 15);
		camera.lookAt(0, 0, 0);

		const light = new THREE.PointLight(0xffffff);
		/* position the light so it shines on the cube (x, y, z) */
		light.position.set(11, 13, 16);
		scene.add(light);

		// Axes
		const axes = new THREE.AxesHelper(5);
		scene.add(axes);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		// Add this only if there is no animation loop (requestAnimationFrame)
		controls.addEventListener('change', () => { this.renderScene(); });

		const geometry = new THREE.BoxGeometry(1, 1, 1);
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
		this.container.appendChild(this.renderer.domElement)

		window.addEventListener( 'resize', () => { this.onWindowResize() }, false );

		// this.start()
		//setTimeout(() => {this.addCube();}, 1000);
		this.renderScene();
	}

	componentWillUnmount() {
		this.container.removeChild(this.renderer.domElement)
	}

	onWindowResize(){
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.renderScene();
	}

	renderScene() {
		this.renderer.render(this.scene, this.camera)
	}

	render() {
		return (
			<div
				className="scene"
				ref={(container) => { this.container = container }} />
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
