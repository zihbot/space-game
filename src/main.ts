import './style.css';
import vertexContent from './shaders/main.vert?raw';
import fragmentContent from './shaders/main.frag?raw';
import Canvas from './canvas';

const app = document.querySelector<HTMLDivElement>('#app')!
const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 500;
app.appendChild(canvas);

const program = new Canvas(canvas);
program.load({
  vertexShader: vertexContent,
  fragmentShader: fragmentContent
});

program.run();
