
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	float newS = vTextureCoord.x;
	float newT = 1.0 - vTextureCoord.y;
	vec2 newCord = vec2(newS,newT);
	vec4 color = texture2D(uSampler, newCord);

	gl_FragColor = color;

}