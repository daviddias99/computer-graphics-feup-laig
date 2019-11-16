
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

	float distanceFromCenter = sqrt( pow(newCord.x - 0.5,2.0)+ pow(newCord.y - 0.5,2.0));

	float exponentBase = 3.0;
	float maxDistance = sqrt(0.5);
	float maxDistanceExp = pow(sqrt(0.5),exponentBase);
	float radialFactor = 1.0 - pow(distanceFromCenter,exponentBase)/maxDistanceExp;

	gl_FragColor = vec4(color.rgb * radialFactor, 1.0);

}