import Program from "../engine/gl/program";
import Renderer from "../engine/renderer";

import vertexShader from './shaders/main.vert?raw';
import fragmentShader from './shaders/main.frag?raw';
import engine from "../engine/engine";

export default class HiveRenderer extends Renderer {
  _program?: Program;

  activate(): void {
    const program = new Program();
    program.attachShader('vertex', vertexShader);
    program.attachShader('fragment', fragmentShader);
    program.link();
    this._program = program;
  }

  preAnimate(): void {
  }

  animate(): void {
    if (!this._program) console.log('No program');
    if (!this._program) return;
    const gl = engine.getContext();
    const program = this._program.getProgram();

    const vertexArray = new Float32Array([
      -0.5, 0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer ?? null);
    const aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}