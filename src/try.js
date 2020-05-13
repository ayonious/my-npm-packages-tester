const _ = require('lodash');
const { add } = require('./aga');

console.log(_.uniq([1, 2, 3, 3]));
console.log(add(1));
/*
; // [1,2,3]


_.difference([1, 2, 3], [3, 4]); // [1,2]
_.remove([1, 2, 3], (val) => val % 2 === 0); // [1,3]
_.reverse([1, 2, 3]); // [3, 2, 1]
_.join(['a', 'b', 'c'], '_'); // a_b_c
_.last([1, 2, 3]); // 3
_.lastIndexOf([1, 2, 3, 3], 3); // 3

*/
