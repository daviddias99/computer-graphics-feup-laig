
function getExtension(str) {

    var startOfExtension = str.lastIndexOf('.');

    if (startOfExtension == -1 || startOfExtension == (str.length - 1))
        return "";

    return str.substring(startOfExtension+1);
}

function isPowerOfTwo(n) {

    if (n == 0)
        return false;

    return Math.ceil(Math.log2(n)) == Math.floor(Math.log2(n));
}