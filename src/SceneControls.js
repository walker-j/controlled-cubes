import { Button, Icon, Popover, Slider, Classes, Intent, H5, Position } from "@blueprintjs/core";
import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

class BasicControls extends Component {
	render() {
		return (
			<div className="controls-row">
				<Button
					icon="plus"
					intent={Intent.PRIMARY}
					large={true}
					onClick={this.props.onAddCube}
				/>
				<span className="primary-text ellipsed-text">Cubes in scene: {this.props.cubeCount}</span>
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
						labelStepSize={9}
						labelRenderer={false}
						max={10}
						min={0.2}
						onChange={this.props.onValueChange}
						stepSize={0.1}
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
							className="color-button"
							icon="tint"
							intent={Intent.WARNING}
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
						<div className="popover-content">
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
					isDefaultValue={this.props.isCubeDefaultSize}
					onResetValue={this.props.onResetCubeSize}
					onValueChange={this.props.onCubeSizeChange}
					value={this.props.cubeSize}
				/>
				{selectedCubeId &&
					<ActiveObjectControls
						onCubeColorChange={this.props.onCubeColorChange}
						onRemoveCube={this.props.onRemoveCube}
						selectedCubeColor={this.props.selectedCubeColor}
						selectedCubeId={selectedCubeId}
					/>}

			</div>
		);
	}
}

export default SceneControls;
