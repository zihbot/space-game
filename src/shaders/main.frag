#version 300 es
precision highp float;

in float aColorModif;
out vec4 FragColor;

uniform vec4 uGlobalColor;

void main() {
  FragColor = uGlobalColor * aColorModif;
}