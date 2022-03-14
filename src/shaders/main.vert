#version 300 es
precision highp float;

in vec2 aVertexPosition;
out float aColorModif;

uniform vec2 uScalingFactor;
uniform vec2 uRotationVector;

void main() {
  vec2 rotatedPosition = vec2(
    aVertexPosition.x * uRotationVector.y + aVertexPosition.y * uRotationVector.x,
    aVertexPosition.y * uRotationVector.y - aVertexPosition.x * uRotationVector.x
  );

  gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
  aColorModif = rotatedPosition.x + 0.5;
}