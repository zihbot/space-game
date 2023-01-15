import Program from '../engine/gl/program';
import Renderer from '../engine/renderer';

import vertexShader from './shaders/main.vert?raw';
import fragmentShader from './shaders/main.frag?raw';
import engine from '../engine/engine';
import Worker from './components/Worker';
import Predator from './components/Predator';

export default class HiveRenderer extends Renderer {
  _program?: Program;
  workers = [] as Worker[];
  predators = [] as Predator[];
  positionBuffer: WebGLBuffer;
  sizeBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;
  spawn = 0;

  activate(): void {
    const program = new Program();
    program.attachShader('vertex', vertexShader);
    program.attachShader('fragment', fragmentShader);
    program.link();
    this._program = program;

    for (let i = 0; i < 10; i++) {
      this.workers.push(new Worker());
    }
    this.predators.push(new Predator());

    const gl = engine.getContext();
    const glProgram = this._program.getProgram();
    gl.useProgram(glProgram);

    this.positionBuffer = gl.createBuffer();
    this.sizeBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
  }

  animate(): void {
    this.spawn++;
    if (this.spawn >= 100) {
      this.workers.push(new Worker());
      this.spawn = 0;
    }

    this.predators.forEach((p) => p.move(this.workers));
    this.workers.forEach((w) => w.move(this.workers, this.predators));
    this.predators.forEach((p) => this.workers = p.eat(this.workers));

    if (!this._program) console.log('No program');
    if (!this._program) return;
    const gl = engine.getContext();
    const program = this._program.getProgram();

    gl.useProgram(program);

    const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([...this.workerPosArray(), ...this.PredatorPosArray()]),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    const aVertexSize = gl.getAttribLocation(program, 'aVertexSize');
    gl.enableVertexAttribArray(aVertexSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        ...this.workers.map((w) => 3),
        ...this.predators.map((w) => 5),
      ]),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(aVertexSize, 1, gl.FLOAT, false, 0, 0);

    const aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(aVertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        ...this.workers.flatMap((w) => [0, 0, 1]),
        ...this.predators.flatMap((w) => [1, 0, 0]),
      ]),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(aVertexColor, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, this.workers.length + this.predators.length);
  }

  workerPosArray(): number[] {
    return this.workers.flatMap((w) => [w.position.x, w.position.y]);
  }
  PredatorPosArray(): number[] {
    return this.predators.flatMap((w) => [w.position.x, w.position.y]);
  }
}
