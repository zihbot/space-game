export function buildShaderProgram (
  gl: WebGL2RenderingContext,
  shaderInfo: {type: number; content: string;}[]
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    console.error('Wrong parameters in buildShaderProgram', gl, program);
    throw new Error('Wrong parameters in buildShaderProgram');
  }

  shaderInfo.forEach(function(desc) {
    let shader = compileShader(gl, desc.content, desc.type);

    if (shader) {
    gl.attachShader(program, shader);
    }
  });

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking shader program:");
    console.log(gl.getProgramInfoLog(program));
  }

  return program;
}

export function compileShader(gl: WebGL2RenderingContext, code: string, type: number): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader || !code) {
    console.error('Wrong parameters in compileShader', type, code);
    throw new Error('Wrong parameters in compileShader');
  }

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}

export function animateScene(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, shaderProgram: WebGLProgram) {

  const aspectRatio = canvas.width/canvas.height;
  const currentRotation = [0, 1];
  const currentScale = [1.0, aspectRatio];
  const degreesPerSecond = 10;

  const vertexArray = new Float32Array([
      -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5, -0.5, -0.5, -0.5
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  const vertexNumComponents = 2;
  const vertexCount = vertexArray.length/vertexNumComponents;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.9, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let currentAngle = 0.0;
  const  radians = currentAngle * Math.PI / 180.0;
  currentRotation[0] = Math.sin(radians);
  currentRotation[1] = Math.cos(radians);

  gl.useProgram(shaderProgram);

  const uScalingFactor =
      gl.getUniformLocation(shaderProgram, "uScalingFactor");
  const uGlobalColor =
      gl.getUniformLocation(shaderProgram, "uGlobalColor");
  const uRotationVector =
      gl.getUniformLocation(shaderProgram, "uRotationVector");

  gl.uniform2fv(uScalingFactor, currentScale);
  gl.uniform2fv(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const aVertexPosition =
      gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

  let previousTime = 0;
  window.requestAnimationFrame(function(currentTime) {
    let deltaAngle = ((currentTime - previousTime) / 1000.0)
          * degreesPerSecond;

    currentAngle = (currentAngle + deltaAngle) % 360;

    previousTime = currentTime;
    animateScene(gl, canvas, shaderProgram);
  });
}