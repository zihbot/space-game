#version 300 es
precision highp float;
/*
layout (location = 0) in vec3 aPos;

out vec4 vertexColor;

void main()
{
    gl_Position = vec4(aPos, 1.0);
    vertexColor = vec4(0.5, 0.0, 0.0, 1.0);
}*/
in vec2 aVertexPosition;

uniform vec2 uScalingFactor;
uniform vec2 uRotationVector;

void main() {
    vec2 rotatedPosition = vec2(
        aVertexPosition.x * uRotationVector.y +
            aVertexPosition.y * uRotationVector.x,
        aVertexPosition.y * uRotationVector.y -
            aVertexPosition.x * uRotationVector.x
    );

    gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
}