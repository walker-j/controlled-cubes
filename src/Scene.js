import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import React3 from 'react-three-renderer';
import * as THREE from 'three'
import threeOrbitControls from 'three-orbit-controls';
import Dimensions from 'react-dimensions'

var OrbitControls = threeOrbitControls(THREE);

class Scene extends Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3(10, 8, 15);
        this.cameraVectoring = new THREE.Vector3(0, 0, 0);
        this.lightPosition = new THREE.Vector3(11, 13, 16);

        this.positions = [];
        this.positions.push(this.randomPosition());
        this.positions.push(this.randomPosition());

        this.state = {
            cubeRotation: new THREE.Euler(0, 0, 0),
        };

        // this._onAnimate = () => {
        //   // we will get this callback every frame

        //   // pretend cubeRotation is immutable.
        //   // this helps with updates and pure rendering.
        //   // React will be sure that the rotation has now updated.
        //   this.setState({
        // 	cubeRotation: new THREE.Euler(
        // 	  this.state.cubeRotation.x + 0.01,
        // 	  this.state.cubeRotation.y + 0.01,
        // 	  0
        // 	),
        //   });
        // };
    }

    randomPosition() {
        return new THREE.Vector3((Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
    }

    componentDidMount() {
        const controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.renderer));
        this.controls = controls;
    }

    componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;
    }

    render() {
        const containerWidth = this.props.containerWidth;
        const containerHeight = this.props.containerHeight;
        
        console.log('RENDER');

        const cubes = this.props.cubes.map(o =>
            <mesh
                key={o.id}
                position={o.position}>
                <boxGeometry
                    width={1}
                    height={1}
                    depth={1}
                />
                <meshLambertMaterial
                    color={o.color}
                />
            </mesh>
        );

        return (
            <React3
                antialias
                clearColor={0x2d2d2d}
                mainCamera="mainCamera"
                width={containerWidth}
                height={containerHeight}
                ref="renderer"
            //onAnimate={this._onAnimate}
            >
                <scene>
                    <perspectiveCamera
                        name="mainCamera"
                        fov={55}
                        aspect={containerWidth / containerHeight}
                        near={0.1}
                        far={1000}
                        ref="camera"
                        lookAt={this.cameraVectoring}
                        position={this.cameraPosition}
                    />
                    <ambientLight
                        color={0xffffff}
                    />
                    <pointLight
                        color={0xffffff}
                        position={this.lightPosition}
                        intensity={0.7}
                    />
                    {cubes}
                </scene>
            </React3>
        );
    }
}

export default Dimensions({ containerStyle: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } })(Scene)