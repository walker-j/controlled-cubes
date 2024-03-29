import Dimensions from 'react-dimensions'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three'
import threeOrbitControls from 'three-orbit-controls';
import './App.css';

var OrbitControls = threeOrbitControls(THREE);

class Scene extends Component {
    constructor(props, context) {
        super(props, context);

        // Use 'new' here rather than within render,
        // otherwise it can mess with React change detection.
        this.hoverColor = '#691919';
        this.selectedColor = '#a50909';

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.cameraVectoring = new THREE.Vector3(0, 0, 0);
        this.lightPosition = new THREE.Vector3(3, 13, 16);
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

    getObjectsUnderMouse(mouseEvent) {
        // Convert to normalized device coordinates (-1 to +1) of renderer 'viewport'
        // TODO: use this.rendererElement.getBoundingClientRect() to make this calculation generic
        this.mouse.x = (mouseEvent.clientX / this.props.containerWidth) * 2 - 1;
        this.mouse.y = - ((mouseEvent.clientY - this.rendererElement.getBoundingClientRect().y) / this.props.containerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.refs.camera);

        return this.raycaster.intersectObjects(this.refs.scene.children, false);
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

    render() {
        const cameraPosition = this.props.cameraPosition;
        const containerWidth = this.props.containerWidth;
        const containerHeight = this.props.containerHeight;
        const cubeSize = this.props.cubeSize;

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
                    depth={cubeSize}
                    height={cubeSize}
                    width={cubeSize}
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
                height={containerHeight}
                mainCamera="mainCamera"
                ref="renderer"
                width={containerWidth}
            >
                <scene ref="scene">
                    <perspectiveCamera
                        aspect={containerWidth / containerHeight}
                        far={1000}
                        fov={55}
                        lookAt={this.cameraVectoring}
                        name="mainCamera"
                        near={0.1}
                        position={cameraPosition}
                        ref="camera"
                    />
                    <ambientLight
                        color={0xffffff}
                    />
                    <pointLight
                        color={0xffffff}
                        intensity={0.7}
                        position={this.lightPosition}
                    />
                    {cubes}
                </scene>
            </React3>
        );
    }
}

// Wrapping scene in element which detects containers size as it changes
export default Dimensions({ containerStyle: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } })(Scene)
