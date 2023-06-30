import { fabric } from 'fabric';
import throttle from 'lodash/throttle';

import Handler from './Handler';
import { FabricObject } from '../utils';
import { NodeObject } from '../objects/Node';
import { LinkObject } from '../objects/Link';

export type TransactionType =
	| 'add'
	| 'remove'
	| 'moved'
	| 'scaled'
	| 'rotated'
	| 'skewed'
	| 'group'
	| 'ungroup'
	| 'paste'
	| 'bringForward'
	| 'bringToFront'
	| 'sendBackwards'
	| 'sendToBack'
	| 'redo'
	| 'undo';

export interface TransactionTransform {
	scaleX?: number;
	scaleY?: number;
	skewX?: number;
	skewY?: number;
	angle?: number;
	left?: number;
	top?: number;
	flipX?: number;
	flipY?: number;
	originX?: string;
	originY?: string;
}

export interface TransactionEvent {
	json: string;
	type: TransactionType;
}

class TransactionHandler {
	handler: Handler;
	redos: TransactionEvent[];
	undos: TransactionEvent[];
	active: boolean = false;
	state: FabricObject[] = [];

	constructor(handler: Handler) {
		this.handler = handler;
		this.initialize();
	}

	/**
	 * Initialize transaction handler
	 *
	 */
	public initialize = () => {
		this.redos = [];
		this.undos = [];
		this.state = [];
		this.active = false;
	};
// document.querySelector("#root > div > div.rde-content > div > div > section > section > div > div.rde-editor-canvas-container > div.rde-editor-header-toolbar > div > div.rde-canvas-toolbar.rde-canvas-toolbar-history > button:nth-child(1)")
	/**
	 * Save transaction
	 *
	 * @param {TransactionType} type
	 * @param {*} [canvasJSON]
	 * @param {boolean} [isWorkarea=true]
	 */
	public save = (type: TransactionType, canvasJSON?: any, _isWorkarea: boolean = true) => {
		console.log("hellos world save")
		if (!this.handler.keyEvent.transaction) {
			return;
		}
		try {
			if (this.state) {
				const json = JSON.stringify(this.state);
				this.redos = [];
				this.undos.push({
					type,
					json,
				});
			}
			const { objects }: { objects: FabricObject[] } =
				canvasJSON || this.handler.canvas.toJSON(this.handler.propertiesToInclude);
			this.state = objects.filter(obj => {
				if (obj.id === 'workarea') {
					return false;
				} else if (obj.id === 'grid') {
					return false;
				} else if (obj.superType === 'port') {
					return false;
				}
				return true;
			});
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * Undo transaction
	 *
	 */
	/**
 * Fetches data from the Picsum API.
 * @returns {Promise<string>} A promise that resolves to the fetched image URL.
 */
public fetchDataFromPicsumAPI = () => {
	return new Promise((resolve, reject) => {
	  fetch('https://picsum.photos/200/300')
		.then(response => {
		  if (response.ok) {
			resolve(response.url);
		  } else {
			reject('Failed to fetch image from Picsum API.');
		  }
		})
		.catch(error => {
		  reject(error);
		});
	});
  };
	public undo = throttle(() => {
		console.log("hello world")
		const undo = this.undos.pop();
		if (!undo) {
			return;
		}
		this.redos.push({
			type: 'redo',
			json: JSON.stringify(this.state),
		});
		this.replay(undo);
	}, 100);

	/**
	 * Redo transaction
	 *
	 */
	public redo = throttle(() => {
		console.log("hello world saving")
		const redo = this.redos.pop();
		if (!redo) {
			return;
		}
		this.undos.push({
			type: 'undo',
			json: JSON.stringify(this.state),
		});
		this.replay(redo);
	}, 100);

	/**
	 * Replay transaction
	 *
	 * @param {TransactionEvent} transaction
	 */
	public replay = (transaction: TransactionEvent) => {
		const objects = JSON.parse(transaction.json) as FabricObject[];
		this.state = objects;
		this.active = true;
		this.handler.canvas.renderOnAddRemove = false;
		this.handler.clear();
		this.handler.canvas.discardActiveObject();
		fabric.util.enlivenObjects(
			objects,
			(enlivenObjects: FabricObject[]) => {
				enlivenObjects.forEach(obj => {
					const targetIndex = this.handler.canvas._objects.length;
					if (obj.superType === 'node') {
						this.handler.canvas.insertAt(obj, targetIndex, false);
						this.handler.portHandler.create(obj as NodeObject);
					} else if (obj.superType === 'link') {
						const link = obj as LinkObject;
						this.handler.objects = this.handler.getObjects();
						this.handler.linkHandler.create({
							type: 'curvedLink',
							fromNodeId: link.fromNode?.id,
							fromPortId: link.fromPort?.id,
							toNodeId: link.toNode?.id,
							toPortId: link.toPort?.id,
						});
					} else {
						this.handler.canvas.insertAt(obj, targetIndex, false);
					}
				});
				this.handler.canvas.renderOnAddRemove = true;
				this.active = false;
				this.handler.canvas.renderAll();
				this.handler.objects = this.handler.getObjects();
				if (this.handler.onTransaction) {
					this.handler.onTransaction(transaction);
				}
			},
			null,
		);
	};
}

export default TransactionHandler;
