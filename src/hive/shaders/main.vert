#version 300 es
precision highp float;

in vec2 aVertexPosition;
in vec3 aVertexColor;
in float aVertexSize;

out vec3 VertexColor;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  gl_PointSize = aVertexSize;
  VertexColor = aVertexColor;
}