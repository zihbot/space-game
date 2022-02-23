export interface CanvasLoadConfig {
  vertexShader: string,
  fragmentShader: string
}

export default class Canvas {
  private program: WebGLProgram;
  private gl: WebGL2RenderingContext;

  private previousTime = 0;
  private currentAngle = 0.0;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error("WebGL 2 not supported");
    this.gl = gl;

    const program = this.gl.createProgram();
    if (!program) {
      console.error('Wrong parameters in buildShaderProgram', program);
      throw new Error('Wrong parameters in buildShaderProgram');
    }
    this.program = program
  }

  load({ vertexShader, fragmentShader }: CanvasLoadConfig) {
    this.attachShader(this.gl.VERTEX_SHADER, vertexShader);
    this.attachShader(this.gl.FRAGMENT_SHADER, fragmentShader);

    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log("Error linking shader program:");
      console.log(this.gl.getProgramInfoLog(this.program));
    }
  }

  private attachShader(type: number, code: string) {
    const shader = this.gl.createShader(type);
    if (!shader || !code) {
      console.error('Wrong parameters in compileShader', type, code);
      throw new Error('Wrong parameters in compileShader');
    }

    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(`Error compiling ${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`);
      console.log(this.gl.getShaderInfoLog(shader));
    }

    this.gl.attachShader(this.program, shader);
  }

  run() {
    this.animateScene();
  }

  private animateScene() {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const currentRotation = [0, 1];
    const currentScale = [1.0, aspectRatio];
    const degreesPerSecond = 10;

    const vertexArray = new Float32Array([
        -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5, -0.5, -0.5, -0.5
    ]);

    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.STATIC_DRAW);

    const vertexNumComponents = 2;
    const vertexCount = vertexArray.length/vertexNumComponents;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.8, 0.9, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const  radians = this.currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    this.gl.useProgram(this.program);

    const uScalingFactor = this.gl.getUniformLocation(this.program, "uScalingFactor");
    const uGlobalColor = this.gl.getUniformLocation(this.program, "uGlobalColor");
    const uRotationVector = this.gl.getUniformLocation(this.program, "uRotationVector");

    this.gl.uniform2fv(uScalingFactor, currentScale);
    this.gl.uniform2fv(uRotationVector, currentRotation);
    this.gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    const aVertexPosition = this.gl.getAttribLocation(this.program, "aVertexPosition");

    this.gl.enableVertexAttribArray(aVertexPosition);
    this.gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);

    window.requestAnimationFrame((currentTime) => {
      //console.log('TIME', currentTime, this.previousTime);

      const deltaAngle = ((currentTime - this.previousTime) / 1000.0) * degreesPerSecond;

      this.currentAngle = (this.currentAngle + deltaAngle) % 360;

      this.previousTime = currentTime;
      this.animateScene();
    });
  }
}