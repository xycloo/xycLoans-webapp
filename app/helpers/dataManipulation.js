export function Normalize(array) {
    var i;
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;
    for (i = 0; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }

    for (i = 0; i < array.length; i++) {
        if (array[i] < min) {
            min = array[i];
        }
    }

    for (i = 0; i < array.length; i++) {
        var norm = array[i] / max;
        array[i] = norm;
    }

    //console.log("normalized data", array)
    return array
}