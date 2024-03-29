/**
 * Gets the extension of a file when provided with the file name
 * @param {String} str  Name of the file with extension
 * @returns {String}    Returns the extension of the file
 */
function getExtension(str) {

    var startOfExtension = str.lastIndexOf('.');

    if (startOfExtension == -1 || startOfExtension == (str.length - 1))
        return "";

    return str.substring(startOfExtension+1);
}

/**
 * Checks if the provided number is a power of 2
 * @param {Number} n    Number that is going to be tested
 * @returns {Boolean}   Returns true is the provided number is a power of 2, returns false otherwise
 */
function isPowerOfTwo(n) {

    if (n == 0)
        return false;

    return Math.ceil(Math.log2(n)) == Math.floor(Math.log2(n));
}

/**
 * Calculates the cross product of two arrays of length equal to 3
 * @param {Array} a     First array
 * @param {Array} b     Second array
 * @returns {Array}     Returns an array that is the cross product of the provided arrays, returns null in case of error
 */
function crossProduct(a, b) {
    if (a.length != b.length)
        return null;

    var result = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    return result;
}

/**
 * Normalizes a vector of length equal to 3
 * @param {Array} vec   Array that is going to be normalized
 * @returns {Array}     Returns the normalized array, returns null in case of error
 */
function normalizeVector(vec) {
    if (vec.length != 3)
        return null;
    
    vecSize = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    var normalizedVec = vec.map( function(x) { return x / vecSize; } );
    return normalizedVec;
}

/**
 * Substracts the elements of the first array with the corresponding elements of the second array
 * @param {Array} a     First array
 * @param {Array} b     Second array
 * @returns {Array}     Array that contains the the result of the subtraction
 */
function subtractArrays(a, b) {
    if (a.length != b.length)
        return null;

    var result = a.map( function(item, index) {
        return item - b[index];
    });

    return result;
}

/**
 * Calculates the Euclidean distance between two different points on the 3D space
 * @param {Array} a     Point a, represented by an array of length equal to 3
 * @param {Array} b     Point b, represented by an array of length equal to 3
 * @returns {Number}    Returns the distance between the two provided points, returns null in case of error
 */
function distance(a, b) {
    if (a.length != 3 || b.length != 3)
        return null;

    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}