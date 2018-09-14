//***Quick Sort Implementation***
let countOuter = 0;
let countInner = 0;
let countSwap = 0;

function resetCounters() {
  countOuter = 0;
  countInner = 0;
  countSwap = 0;
}

function QuickSort(array, left, right) {
  countOuter++;
  left = left || 0;
  right = right || array.length - 1;

  const pivot = partitionHoare(array, left, right);

  if(left < pivot - 1) {
    QuickSort(array, left, pivot - 1);
  }
  if(right > pivot) {
    QuickSort(array, pivot, right);
  }
  return array;
}

// Hoare partition scheme... most efficient partition scheme for use in quick sort.
function partitionHoare(array, left, right) {
  const pivot = Math.floor((left + right) / 2 );

  while(left <= right) {
    countInner++;
    while(array[left] < array[pivot]) {
      left++;
    }
    while(array[right] > array[pivot]) {
      right--;
    }
    if(left <= right) {
      countSwap++;
      [array[left], array[right]] = [array[right], array[left]];
      left++;
      right--;
    }
  }
  return left;
}

const nodea = {cost:204 };
const nodeb = {cost:810 };
const nodec = {cost:25 };
const noded = {cost:45 };
const nodee = {cost:90 };
const nodef = {cost:3 };

QuickSort([nodea.cost,nodeb.cost,nodec.cost,noded.cost,nodee.cost])
