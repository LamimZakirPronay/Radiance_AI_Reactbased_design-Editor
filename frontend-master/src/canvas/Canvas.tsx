import { fabric } from 'fabric';
import React, { Component, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { v4 as uuid } from 'uuid';
import { defaults } from './constants';
import Handler, { HandlerOptions } from './handlers/Handler';
import './styles/canvas.less';
import './styles/contextmenu.less';
import './styles/fabricjs.less';
import './styles/tooltip.less';
import { FabricCanvas } from './utils';

export interface CanvasInstance {
  handler: Handler;
  canvas: FabricCanvas;
  container: HTMLDivElement;
}

export type CanvasProps = HandlerOptions & {
  responsive?: boolean;
  style?: React.CSSProperties;
};

interface IState {
  id: string;
  loaded: boolean;
}

class InternalCanvas extends Component<CanvasProps, IState> implements CanvasInstance {
  public handler: Handler;
  public canvas: FabricCanvas;
  public container: HTMLDivElement;
  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: ResizeObserver;

  static defaultProps: CanvasProps = {
    id: uuid(),
    editable: true,
    zoomEnabled: true,
    minZoom: 30,
    maxZoom: 300,
    responsive: true,
    width: 0,
    height: 0,
  };

  state: IState = {
    id: uuid(),
    loaded: false,
  };

  componentDidMount() {
    const { editable, canvasOption, width, height, responsive, ...other } = this.props;
    const { id } = this.state;
    const mergedCanvasOption = Object.assign({}, defaults.canvasOption, canvasOption, {
      width,
      height,
      selection: (typeof canvasOption?.selection !== 'undefined' && canvasOption?.selection) || editable,
    });
    this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
    this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
    this.canvas.renderAll();
    this.container = this.containerRef.current;
    this.handler = new Handler({
      id,
      width,
      height,
      editable,
      canvas: this.canvas,
      container: this.containerRef.current,
      canvasOption: mergedCanvasOption,
      ...other,
    });
    if (this.props.responsive) {
      this.createObserver();
    } else {
      this.handleLoad();
    }
  }

  componentDidUpdate(prevProps: CanvasProps) {
    // Update logic here...
  }

  componentWillUnmount() {
    this.destroyObserver();
    this.handler.destroy();
  }


	createObserver = () => {
		this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};
			this.handler.eventHandler.resize(width, height);
			if (!this.state.loaded) {
				this.handleLoad();
			}
		});
		this.resizeObserver.observe(this.containerRef.current);
	};

	destroyObserver = () => {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	};

	handleLoad = () => {
		this.setState(
		  {
			loaded: true,
		  },
		  () => {
			if (this.props.onLoad) {
			  this.props.onLoad(this.handler, this.canvas);
			}
		  },
		);
	  };
	  fetching = () => {
		const { canvas } = this.handler;
	  
		fetch('https://picsum.photos/200/300')
		  .then(response => {
			if (response.ok) {
			  return response.blob();
			} else {
			  throw new Error('Failed to fetch image from Picsum API.');
			}
		  })
		  .then(blob => {
			fabric.Image.fromURL(URL.createObjectURL(blob), img => {
			  img.set({
				left: 0,
				top: 0,
			  });
			  canvas.add(img);
			  canvas.setActiveObject(img);
			  canvas.renderAll();
			});
		  })
		  .catch(error => {
			console.error(error);
		  });
	  };
	  
	
	  render() {
		const { style } = this.props;
		const { id } = this.state;
		return (
		  <div
			ref={this.containerRef}
			id={id}
			className="rde-canvas"
			style={{ width: '100%', height: '100%', ...style }}
		  >
			<button onClick={this.fetching}>.  Call API  .</button>
			<canvas id={`canvas_${id}`} />
		  </div>
		);
	  }
	}
	
	const Canvas: React.FC<CanvasProps> = React.forwardRef<CanvasInstance, CanvasProps>((props, ref) => {
	  const canvasRef = useRef<InternalCanvas>();
	  React.useImperativeHandle(ref, () => ({
		handler: canvasRef.current.handler,
		canvas: canvasRef.current.canvas,
		container: canvasRef.current.container,
	  }));
	  return <InternalCanvas ref={canvasRef} {...props} />;
	});
	
	export default Canvas;