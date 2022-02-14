export default function MergeSort(
    array: number[], 
    length: number, 
    callback: (start: number, end: number, index: number[], delay: number) => void
): number[] {
    let delay = 0;
    for (let size = 1; size <= length; size = 2 * size) {
        for (let left = 0; left < length; left += 2 * size) {
            const mid = Math.min(left + size - 1, length);
            const right = Math.min(left + 2 * size - 1, length);

            merge(array, left, mid, right);
            callback(left, right, [...array].reverse(), delay);
            delay++;
        }
    }

    callback(-1, -1, array, delay);
    return array;
}

function merge(
    array: number[], 
    l: number, 
    m: number, 
    r: number, 
): void {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = Array(n1).fill(0);
    const R = Array(n2).fill(0);

    for (let i = 0; i < n1; i++) {
        L[i] = array[l + i];
    }
    for (let i = 0; i < n2; i++) {
        R[i] = array[m + 1 + i];
    }
    
    let i: number = 0;
    let j: number = 0;
    let k: number = l;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++
        } else {
            array[k] = R[j];
            j++
        }
        k++
    }

    while (i < n1) {
        array[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        array[k] = R[j];
        j++;
        k++;
    }
}