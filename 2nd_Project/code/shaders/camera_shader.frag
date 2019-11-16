
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float nStripes;
uniform float nRepitition;
uniform float OtherFactor;
uniform float timefactor;

void main() {

	float newS = vTextureCoord.x;
	float newT = 1.0 - vTextureCoord.y;
	vec2 newCord = vec2(newS,newT);
	vec4 color = texture2D(uSampler, newCord);

	float distanceFromCenter = sqrt( pow(newCord.x - 0.5,2.0)+ pow(newCord.y - 0.5,2.0));

	const float exponentBase = 3.0;
	float maxDistance = sqrt(0.5);
	float maxDistanceExp = pow(sqrt(0.5),exponentBase);
	float radialFactor = 1.0 - pow(distanceFromCenter,exponentBase)/maxDistanceExp;


	const float nStripes = 10.0;
	const float nRepetition = 2.0;
	const float otherFactor = 1.0;
	const float lineFactorValue = 0.5;

	float lineFactor = 1.0;
	// float realTimeFactor = mod(timefactor / 10000.0, 10.0);

	if(mod( mod(vTextureCoord.y + timefactor,nStripes) * nStripes, nRepetition) > otherFactor)
		lineFactor = lineFactorValue;
	

	gl_FragColor = vec4(color.rgb * radialFactor * lineFactor, 1.0);

}