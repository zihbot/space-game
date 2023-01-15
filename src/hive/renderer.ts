import Program from '../engine/gl/program';
import Renderer from '../engine/renderer';

import vertexShader from './shaders/main.vert?raw';
import fragmentShader from './shaders/main.frag?raw';
import engine from '../engine/engine';
import Worker from './components/Worker.';

export default class HiveRenderer extends Renderer {
  _program?: Program;
  workers = [] as Worker[];

  activate(): void {
    const program = new Program();
    program.attachShader('vertex', vertexShader);
    program.attachShader('fragment', fragmentShader);
    program.link();
    this._program = program;

    for (let i = 0; i < 10; i++) {
      this.workers.push(new Worker());
    }

    const gl = engine.getContext();
    const glProgram = this._program.getProgram();
    gl.useProgram(glProgram);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.workerPosArray(), gl.STATIC_DRAW);
  }

  animate(): void {
    if (!this._program) console.log('No program');
    if (!this._program) return;
    const gl = engine.getContext();
    const program = this._program.getProgram();

    //const vertexArray = new Float32Array([-0.5, 0.5, 0.5, 0.5, 0.5, -0.5]);

    gl.useProgram(program);

    //const vertexBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, this.workers.length);
  }

  workerPosArray(): Float32Array {
    return new Float32Array(this.workers.flatMap((w) => [w.pos.x, w.pos.y]));
  }
}
