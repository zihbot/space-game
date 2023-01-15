#version 300 es
precision highp float;

in vec2 aVertexPosition;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  gl_PointSize = 3.0;
}