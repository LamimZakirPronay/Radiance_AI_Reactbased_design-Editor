import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import Canvas from '../../canvas/Canvas';
import { Flex } from '../../components/flex';
import ImageMapList from './ImageMapList';
import { CommonButton, InputHtml } from '../../components/common';
import Icon from '../../components/icon/Icon';
import { Input } from 'antd';

class ImageMapHeaderToolbar extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
	};
	
	render() {
		const { canvasRef, selectedItem } = this.props;
		const isCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
		return (
			<Flex className="rde-editor-header-toolbar-container" flex="1">
				{/* <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-list">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						icon="layer-group"
						tooltipTitle={i18n.t('action.canvas-list')}
					/>
					<div className="rde-canvas-list">
						<ImageMapList canvasRef={canvasRef} selectedItem={selectedItem} />
					</div>
				</Flex.Item> */}
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringForward()}
						icon="angle-up"
						tooltipTitle={i18n.t('action.bring-forward')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendBackwards()}
						icon="angle-down"
						tooltipTitle={i18n.t('action.send-backwards')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringToFront()}
						icon="angle-double-up"
						tooltipTitle={i18n.t('action.bring-to-front')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendToBack()}
						icon="angle-double-down"
						tooltipTitle={i18n.t('action.send-to-back')}
					/>
				</Flex.Item>
				{/* <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.left()}
						icon="align-left"
						tooltipTitle={i18n.t('action.align-left')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.center()}
						icon="align-center"
						tooltipTitle={i18n.t('action.align-center')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.right()}
						icon="align-right"
						tooltipTitle={i18n.t('action.align-right')}
					/>
				</Flex.Item> */}
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-group">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.toGroup()}
						icon="object-group"
						tooltipTitle={i18n.t('action.object-group')}
					/>
					<CommonButton
  className="rde-action-btn"
  onClick={() => {

	
	<Alert>This is an error alert — check it out!</Alert>
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
  }
  
  }
>
  Generate Image Twice
</CommonButton>
				</Flex.Item>



				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-group">
					
					<CommonButton
  className="rde-action-btn"
  onClick={() => {
    const obj = this.props.selectedItem; // Assuming this.props.selectedItem is the FabricImage object
    if (obj) {
      obj.set('file', null);
      fetch('https://picsum.photos/200/300')
        .then(response => {
          if (response.ok) {
            return response.url;
          } else {
            throw new Error('Failed to fetch image from Picsum API.');
          }
        })
        .then(url => {
          return new Promise((resolve, reject) => {
            obj.setSrc(url, () => this.props.canvasRef.handler.canvas.renderAll(), {
              dirty: true,
            }, (img, isError) => {
              if (isError) {
                reject('Failed to set image source.');
              } else {
                resolve(img);
              }
            });
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }}
>
  Get Image From PICSUM
</CommonButton>
				</Flex.Item>

				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-crop">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.validType() : true}
						onClick={() => canvasRef.handler?.cropHandler.start()}
						icon="crop"
						tooltipTitle={i18n.t('action.crop')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.finish()}
						icon="check"
						tooltipTitle={i18n.t('action.crop-save')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.cancel()}
						icon="times"
						tooltipTitle={i18n.t('action.crop-cancel')}
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-operation">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.saveImage()}
						icon="image"
						tooltipTitle={i18n.t('action.image-save')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.duplicate()}
						icon="clone"
						tooltipTitle={i18n.t('action.clone')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.remove()}
						icon="trash"
						tooltipTitle={i18n.t('action.delete')}
					/>
					{/* src/editors/imagemap/ImageMapHeaderToolbar.js */}
					<Input />
				</Flex.Item>
				
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-history">
					<CommonButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.undos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.undo()}
					>
						<Icon name="undo-alt" style={{ marginRight: 8 }} />
						Undo
					</CommonButton>
					<CommonButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.redos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.redo()}
					>
						Redo
						<Icon name="redo-alt" style={{ marginLeft: 8 }} />
					</CommonButton>
				</Flex.Item>
			</Flex>
		);
	}
}

export default ImageMapHeaderToolbar;
