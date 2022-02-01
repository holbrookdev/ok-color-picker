export function round(number: number, decimals: number = 0): number {
  const rounded =
    decimals === -1
      ? number
      : Number(`${Math.round(Number(`${number}e${decimals}`))}e-${decimals}`);
  return isNaN(rounded) ? 0 : rounded;
}

export function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}

export type matrix = number[][];

export function multiplyMatrices(
  a: matrix,
  b: matrix,
  flat = true
): matrix | number[] {
  checkInput(a, b);
  const [matrixA, matrixB] =
    a.length <= b.length ? [a, toColumns(b)] : [b, toColumns(a)];

  const matrix = resultMatrix(a, b).map((_, i) =>
    _.map((_, j) => dotProduct(matrixA[i], matrixB[j]))
  );

  return flat ? matrix.flat() : matrix;
}

function checkInput(a: matrix, b: matrix) {
  const error =
    "Number of columns in the first matrix must equal number of rows in the second matrix.";
  if (a[0].length !== b.length) throw new Error(error);
}

function toColumns(matrix: matrix): matrix {
  return matrix[0].map((_, i) => matrix.map((x) => x[i]));
}

function resultMatrix(a: matrix, b: matrix): matrix {
  return new Array(Math.min(a.length, b.length)).fill(
    new Array(Math.min(a[0].length, b[0].length)).fill(0)
  );
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
