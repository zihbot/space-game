import Program from '../engine/gl/program';
import Renderer from '../engine/renderer';

import vertexShader from './shaders/main.vert?raw';
import fragmentShader from './shaders/main.frag?raw';
import engine from '../engine/engine';
import Worker from './components/Worker';

export default class HiveRenderer extends Renderer {
  _program?: Program;
  workers = [] as Worker[];
  workerBuffer: WebGLBuffer;

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

    this.workerBuffer = gl.createBuffer();
  }

  animate(): void {
    this.workers.forEach(w => w.move(this.workers));

    if (!this._program) console.log('No program');
    if (!this._program) return;
    const gl = engine.getContext();
    const program = this._program.getProgram();

    gl.useProgram(program);

    const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.workerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.workerPosArray(), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, this.workers.length);
  }

  workerPosArray(): Float32Array {
    return new Float32Array(this.workers.flatMap((w) => [w.position.x, w.position.y]));
  }
}
