
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timefactor;

// Function to generate random numbers
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

///
/// Configuration values
///

// Noise configuration
const float lineNoiseSoftnessFactor = 15.0;
const float generalNoiseSoftnessFactor = 8.0;

// Camera-lines configuration values
const float nStripes = 7.0;
const float nRepetition = 2.0;
const float otherFactor = 1.0;
const float lineFactorValue = 0.05;

// Radial darkenning configuration values

const float distanceDarkenningScaleFactor = 0.9;

void main() {

	// Fetch the texture-color value for the current point. The first lines invert the horizontal axis values.
	float newS = vTextureCoord.x;
	float newT = 1.0 - vTextureCoord.y;
	vec2 newCord = vec2(newS,newT);
	vec4 color = texture2D(uSampler, newCord);

	// Generate random noise
	vec2 st = gl_FragCoord.xy/timefactor;
	float noise = rand(st);
	
	// Change color to grayscale
	vec4 grayscaleColor = color;
	grayscaleColor.r = color.r * 0.299 + color.g *0.587 + color.b * 0.114;
	grayscaleColor.g = color.r * 0.299 + color.g *0.587 + color.b * 0.114;
	grayscaleColor.b = color.r * 0.299 + color.g *0.587 + color.b * 0.114;


	// Distance from the center point of the texture to the current point
	float distanceFromCenter = sqrt( pow(newCord.x - 0.5,2.0)+ pow(newCord.y - 0.5,2.0));

	// Calculate the radial darkenning value.

	const float maxDistance = sqrt(0.5);
	float radialFactor = 1.0 - distanceDarkenningScaleFactor * distanceFromCenter / maxDistance;

	float lineFactor = 0.0;

	// Check if the current point is "inside" a camera line. If so calculate it's value.
	// The value is additive, as such, whem adding it to the color the upper limit of 1.0 must be respected.
	if(mod((vTextureCoord.y + timefactor + noise/lineNoiseSoftnessFactor) * nStripes, nRepetition) > otherFactor)
		lineFactor = lineFactorValue;
	
	gl_FragColor = vec4(mod(grayscaleColor.rgb + noise/generalNoiseSoftnessFactor + lineFactor,1.0) * radialFactor, 1.0);

}