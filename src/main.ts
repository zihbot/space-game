import './style.css';
import { animateScene, buildShaderProgram } from './utils';
import vertexContent from './shaders/main.vert?raw';
import fragmentContent from './shaders/main.frag?raw';

const app = document.querySelector<HTMLDivElement>('#app')!
const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 500;
app.appendChild(canvas);

window.addEventListener("load", startup, false);

function startup() {
  const gl = canvas.getContext('webgl2');
  if (!gl) return;

  const shaderSet = [
    {
      type: gl.VERTEX_SHADER,
      content: vertexContent
    },
    {
      type: gl.FRAGMENT_SHADER,
      content: fragmentContent
    }
  ];

  const shaderProgram = buildShaderProgram(gl, shaderSet);

  animateScene(gl, canvas, shaderProgram);
}