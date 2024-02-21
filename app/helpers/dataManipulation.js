export function Normalize(array) {

    const min = Math.min(...array);
    const max = Math.max(...array);
    
    const range = max - min;
    
    const normalizedArray = array.map(value => (value - min) / range);
    
    return normalizedArray;
}