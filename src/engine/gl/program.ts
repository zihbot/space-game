import engine from "../engine";

export type ShaderType = 'vertex' | 'fragment';
export default class Program {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;

  constructor() {
    this.gl = engine.getContext();
    const program = this.gl.createProgram();
    if (!program) {
      console.error('Cannot create GL program', this.gl.getError());
      throw new Error('Cannot create GL program');
    }
    this.program = program;
  }

  public attachShader(type: ShaderType, code: string) {
    let typeNumber: number;
    switch (type) {
      case 'vertex':
        typeNumber = this.gl.VERTEX_SHADER;
        break;
      case 'fragment':
        typeNumber = this.gl.FRAGMENT_SHADER;
        break;
    }

    const shader = this.gl.createShader(typeNumber);
    if (!shader || !code) {
      console.error('Wrong parameters in compileShader', type, code);
      throw new Error('Wrong parameters in compileShader');
    }

    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.warn(`Error compiling ${type} shader:`);
      console.warn(this.gl.getShaderInfoLog(shader));
    }

    this.gl.attachShader(this.program, shader);
  }

  public link() {
    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.warn("Error linking shader program:");
      console.warn(this.gl.getProgramInfoLog(this.program));
    }
  }

  getProgram(): WebGLProgram {
    return this.program;
  }
}