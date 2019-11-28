attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

void main() {

	gl_Position = vec4(aVertexPosition, 1.0);   // Remove the view matrix and projection matrix applications in order to place the camera as an overlay
    vTextureCoord = aTextureCoord;	

}