import React, { Component } from 'react';
import { throttle } from 'lodash';

import { CanvasContainerS, BlobOnCanvas, CanvasStitch } from './styled';

let y2;
export default class ColorBlob extends Component{
  blob = React.createRef()
  stitch = React.createRef()

  generate = throttle(() => {
    const randomGaussian = (mean = 0, sd = 1) => {
      let y1;
      let x1;
      let x2
      let w;
      let previous;
      if (previous) {
        y1 = y2;
        previous = false;
      } else {
        do {
          x1 = (Math.random() * 2) - 1;
          x2 = (Math.random() * 2) - 1;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        previous = true;
      }
      return y1 * sd + mean;
    };

    const randomBetween = (min, max) => (Math.random() * (max - min + 1)) + min;

    const ctx = this.blob.current.getContext('2d');

    // stitch pattern
    const ctxStitch = this.stitch.current.getContext('2d');
    const stitchWidth = 60;

    ctxStitch.canvas.width = stitchWidth;
    ctxStitch.canvas.height = stitchWidth;

    ctxStitch.strokeStyle = `rgba(220, 220, 220, 0.1)`;

    ctxStitch.beginPath();
    ctxStitch.moveTo(0, 10);
    ctxStitch.lineTo(stitchWidth, stitchWidth);
    ctxStitch.stroke();
    ctxStitch.closePath();

    ctxStitch.beginPath();
    ctxStitch.moveTo(0, stitchWidth);
    ctxStitch.lineTo(stitchWidth, 0);
    ctxStitch.stroke();
    ctxStitch.closePath();

    const stitchPattern = ctx.createPattern(ctxStitch.canvas, 'repeat');

    const W = window.innerWidth;
    const H = window.innerHeight;

    // starting point for drawing
    const MID_X = W * 0.5;
    const MID_Y = H * 0.5;

    // overlays green, blue, and red blobs - smaller # separates them, larger # brings them on top of eachother
    const EDGES = 12;

    const TAU = Math.PI * 2;
    const R = Math.min(Math.min(MID_X, MID_Y) * 0.5, 150);

    // adds white or something to colors. As # gets smaller, colors seem to part for whiteness.
    const ALPHA = 0.006;
    const COLORS = [
      `hsla(330, 100%, 50%, ${ALPHA})`,
      `hsla(210, 100%, 50%, ${ALPHA})`,
      `hsla(140, 100%, 50%, ${ALPHA})`,
      `hsla(0, 100%, 50%, ${ALPHA})`,
    ];

    const INTERLEAVE = 5;

    const VARIANCE_DEFAULT = 20;
    const NUM_POLIES = 200;
    const DEPTH = 2;
    const NUM_SPOTS = 3;
    const ANGLE_STEP = TAU / NUM_SPOTS;

    let polyCount = 0;
    let rafId;

    ctx.globalCompositeOperation = 'multiply';
    ctx.canvas.width = W;
    ctx.canvas.height = H;

    // get the points for a regular polygon with <edges>
    const getPoly = (midX, midY, r, edges) => {
      const vertices = [];
      const angleStep = TAU / edges;
      for (let angle = 0; angle < TAU; angle += angleStep) {
        const x = midX + Math.cos(angle) * r;
        const y = midY + Math.sin(angle) * r;
        vertices.push({ x, y });
      }
      return vertices;
    };

    // add extra point between each side of the polygon
    const deformPoly = (vertices, depth, variance, varianceDecrease) => {
      let deformedVertices = [];
      for (let i = 0; i < vertices.length; i++) {
        const from = vertices[i];
        const to = i === vertices.length - 1 ? vertices[0] : vertices[i + 1];
        const midX = (from.x + to.x) * 0.5;
        const midY = (from.y + to.y) * 0.5;
        const newX = midX + randomGaussian() * variance;
        const newY = midY + randomGaussian() * variance;
        deformedVertices.push(from);
        deformedVertices.push({ x: newX, y: newY });
      }
      if (depth > 0) {
        depth--;
        return deformPoly(deformedVertices, depth, variance / varianceDecrease, varianceDecrease);
      }
      return deformedVertices;
    };

    const drawPoly = (vertices, color) => {
      const [firstVertex] = vertices;
      ctx.save();
      ctx.translate(MID_X, MID_Y);
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(firstVertex.y, firstVertex.x);
      for (let i = 1; i < vertices.length; i++) {
        const vertex = vertices[i];
        ctx.lineTo(vertex.x, vertex.y);
      }
      ctx.lineTo(firstVertex.x, firstVertex.y);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    // blend the polygons
    const drawLayer = (poly, polyIndex) => {
      for (let i = 0; i < INTERLEAVE; i++) {
        requestAnimationFrame(() => {
          const deformed = deformPoly(poly, DEPTH, VARIANCE_DEFAULT + randomBetween(20, 15), 4);
          drawPoly(deformed, COLORS[polyIndex]);
        });
      }
    };

    const reset = () => {
      polyCount = 0;
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, ctx.canvas.width,ctx.canvas.height);
    };

    reset();
    const polies = new Array(NUM_SPOTS).fill().map((_, i) => {
      const poly = getPoly(
        Math.cos(ANGLE_STEP * i) * (R * 0.5) * randomGaussian(1,),
        Math.sin(ANGLE_STEP * i) * (R * 0.5) * randomGaussian(1,),
        R + randomBetween(-15, 15),
        EDGES
      );
      return deformPoly(poly, DEPTH, VARIANCE_DEFAULT, 2);
    });

    ctx.fillStyle = stitchPattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const draw = () => {
      polies.forEach(drawLayer);
      polyCount += INTERLEAVE;
      if (polyCount < NUM_POLIES) {
        rafId = requestAnimationFrame(draw);
      }
    };
    draw();
  }, 1000, {leading: true})

  componentDidUpdate(previousProps){
    if(this.props.watchValue !== previousProps.watchValue){
      this.generate();
    }
  }
  componentDidMount(){
    this.generate();
  }

  render(){

    return(
      <CanvasContainerS
        width={this.props.width || 200}
        height={this.props.height || 200}
        onClick={this.generate}
        className="container"
        leftAlign={this.props.leftAlign}
        topAlign={this.props.topAlign}
        canvasWidth={5}
        canvasHeight={10}
      >
        <BlobOnCanvas
        blobWidth={1000}
        ref={this.blob}></BlobOnCanvas>
        <CanvasStitch ref={this.stitch}></CanvasStitch>
      </CanvasContainerS>
    )
  }
}
