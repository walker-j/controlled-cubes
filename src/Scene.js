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

        this.hoverColor = '#FF0000';
        this.selectedColor = '#00FF00';

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraVectoring = new THREE.Vector3(0, 0, 0);
        this.lightPosition = new THREE.Vector3(3, 13, 16);

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

    componentDidMount() {
        this.rendererElement = ReactDOM.findDOMNode(this.refs.renderer);

        const controls = new OrbitControls(this.refs.camera, this.rendererElement);
        controls.addEventListener('change', (event) => { this.props.onCameraChange(event.target.object.position); });
        this.controls = controls;

        this.rendererElement.addEventListener('mousemove', (e) => { this.onMouseMove(e); }, false);
        this.rendererElement.addEventListener('mousedown', (e) => { this.onMouseDown(e); }, false);
    }

    componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;

        this.rendererElement.removeEventListener('mousemove');
        this.rendererElement.removeEventListener('mousedown');
    }

    onMouseDown(event) {
        var intersect = this.getObjectsUnderMouse(event);
        if (intersect[0]) {
            this.props.onCubeSelect(intersect[0].object.name);
        }
    }

    onMouseMove(event) {
        var intersect = this.getObjectsUnderMouse(event);
        if (intersect[0]) {
            this.props.onCubeHover(intersect[0].object.name);
        } else {
            this.props.onCubeHover(null);
        }
    }

    getObjectsUnderMouse(mouseEvent) {
        // Convert to normalized device coordinates (-1 to +1) of renderer 'viewport'
        // TODO: use this.rendererElement.getBoundingClientRect() to make this calculation generic
        this.mouse.x = (mouseEvent.clientX / this.props.containerWidth) * 2 - 1;
        this.mouse.y = - ((mouseEvent.clientY - this.rendererElement.getBoundingClientRect().y) / this.props.containerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.refs.camera);

        return this.raycaster.intersectObjects(this.refs.scene.children, false);
    }

    render() {
        console.log('RENDER');

        

        const containerWidth = this.props.containerWidth;
        const containerHeight = this.props.containerHeight;
        const cubeSize = this.props.cubeSize;
        const cameraPosition = this.props.cameraPosition;

        const cubes = this.props.cubes.map(o => {
            let color = o.color;
            const id = o.id.toString();
            if (this.props.selectedCubeId === id) {
                color = this.selectedColor;
            } else if (this.props.hoveredCubeId === id) {
                color = this.hoverColor;
            }
            return (<mesh
                key={o.id}
                position={o.position}
                name={id}>
                <boxGeometry
                    width={cubeSize}
                    height={cubeSize}
                    depth={cubeSize}
                />
                <meshLambertMaterial
                    color={color}
                />
            </mesh>);
        });

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
                <scene ref="scene">
                    <perspectiveCamera
                        name="mainCamera"
                        fov={55}
                        aspect={containerWidth / containerHeight}
                        near={0.1}
                        far={1000}
                        ref="camera"
                        lookAt={this.cameraVectoring}
                        position={cameraPosition}
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
