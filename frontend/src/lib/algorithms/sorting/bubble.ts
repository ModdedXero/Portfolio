export default function BubbleSort(array: number[], callback: (index1: number[], index2: number[], delay: number) => void): number[] {
    let delay = 0;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i; j++) {
            const current = array[j];
            if (array[j] < array[j + 1]) {
                array[j] = array[j + 1];
                array[j + 1] = current;
                callback([j, array[j]], [j + 1, current], delay);
            } else {
                callback([j, current], [j + 1, undefined], delay);
            }

            delay++;
        }
    }

    callback(undefined, undefined, delay++);
    return array;
}