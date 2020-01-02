
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	// Fetch the texture-color value for the current point. The first lines invert the horizontal axis values.
	float newS = vTextureCoord.x;
	float newT = vTextureCoord.y;
	vec2 newCord = vec2(newS,newT);
	vec4 color = texture2D(uSampler, newCord);
	
	gl_FragColor = color;

}