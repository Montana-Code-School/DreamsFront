import styled from "styled-components";

export const CanvasContainerS = styled.div`
  z-index: -1;
  position: relative;
  top: ${props => props.topAlign}rem;
  left: ${props => props.leftAlign}rem;
  width: ${props => props.canvasWidth}vw;
  height: ${props => props.canvasHeight}vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const BlobOnCanvasS = styled.canvas`
  width:${props => props.blobWidth}%;
  align-items: center;
`
export const CanvasStitchS = styled.canvas`
  display: flex;
  justify-content: center;
  align-items: center;
`
