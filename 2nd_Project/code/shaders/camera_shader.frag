
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// uniform float nStripes;
// uniform float nRepitition;
// uniform float OtherFactor;
uniform float timefactor;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

	float newS = vTextureCoord.x;
	float newT = 1.0 - vTextureCoord.y;
	vec2 newCord = vec2(newS,newT);
	vec4 color = texture2D(uSampler, newCord);


	vec2 st = gl_FragCoord.xy/timefactor;
	float noise = rand(st);
	
	vec4 grayscaleColor = color;
	grayscaleColor.r = color.r * 0.299 + color.g *0.587 + color.b * 0.114;
	grayscaleColor.g = color.r * 0.299 + color.g *0.587 + color.b * 0.114;
	grayscaleColor.b = color.r * 0.299 + color.g *0.587 + color.b * 0.114;

	float distanceFromCenter = sqrt( pow(newCord.x - 0.5,2.0)+ pow(newCord.y - 0.5,2.0));

	const float exponentBase = 50.0;
	float maxDistance = sqrt(0.5);
	float maxDistanceExp = pow(exponentBase,maxDistance);
	float radialFactor = 1.0 - pow(exponentBase,distanceFromCenter)/maxDistanceExp;

	// Y = (X-0)/(maxDistance-0) * (D-0) + C

	const float nStripes = 7.0;
	const float nRepetition = 2.0;
	const float otherFactor = 1.0;
	const float lineFactorValue = 0.05;

	float lineFactor = 0.0;

	if(mod((vTextureCoord.y + timefactor + noise/15.0) * nStripes, nRepetition) > otherFactor)
		lineFactor = lineFactorValue;
	

	gl_FragColor = vec4(mod(grayscaleColor.rgb + noise/8.0 + lineFactor,1.0) * radialFactor, 1.0);

}