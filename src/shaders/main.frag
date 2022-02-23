#version 300 es
precision highp float;
/*
out vec4 FragColor;

in vec4 vertexColor;

void main()
{
    FragColor = vertexColor;
}*/
out vec4 FragColor;

uniform vec4 uGlobalColor;

void main() {
    FragColor = uGlobalColor;
}