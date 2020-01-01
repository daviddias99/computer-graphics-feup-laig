function calcParabolaCoefs( x1,  y1,  x2,  y2,  x3,  y3)
{
    let denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
    let A     = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
    let B     = (x3*x3 * (y1 - y2) + x2*x2 * (y3 - y1) + x1*x1 * (y2 - y3)) / denom;
    let C     = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;

    return [A,B,C];
}

class QuadraticKfGenerator{


    constructor(){

    }

    static generateKeyFrames(startPos, endPos, height, time, keyframeCount){

        let keyframes = [];
        let midPoint = (endPos[2] - startPos[2])/2;
        let coefs = calcParabolaCoefs(startPos[2],startPos[1],startPos[2] + midPoint,height,endPos[2],endPos[1]);

        let timeStep = time/keyframeCount;
        let currentTime = 0;
        let currentZ = startPos[2];
        let zDelta = (endPos[2] - startPos[2])/keyframeCount;
        


        for(let i = 0; i <= keyframeCount ; i++){

            let newTranslation = [0,coefs[0] * currentZ * currentZ + coefs[1] * currentZ + coefs[2] - startPos[1],currentZ - startPos[2]] 
            keyframes.push(new KeyFrame(currentTime, newTranslation,[0,0,0],[1,1,1]))
            currentZ += zDelta;
            currentTime += timeStep;

        }

        return keyframes;

    }


}