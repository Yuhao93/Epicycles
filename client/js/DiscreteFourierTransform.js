goog.provide('org.haodev.epicycle.DiscreteFourierTransform');

goog.require('org.haodev.epicycle.Circle');
goog.require('org.haodev.epicycle.ComplexNumber');



/**
 * @param {!Array.<!org.haodev.epicycle.ComplexNumber>} arr
 * @param {number=} k
 * @return {!Array.<org.haodev.epicycle.ComplexNumber>}
 * Computes the discrete fourier transform on a series of points with size n.
 */
org.haodev.epicycle.DiscreteFourierTransform = function(arr, k) {
  var l = isNaN(k) ? 200 : k;
  if (l % 2 == 1) {
    l++;
  }
  var nums = [];
  for (var i = 0; i < l; i++) {
    var spin = i - l/2;
    var num = new org.haodev.epicycle.ComplexNumber(0, 0);
    for (var j = 0; j < arr.length; j++) {
      var n = arr[j].clone();
      n.multiply(org.haodev.epicycle.ComplexNumber.from(
          1, -2 * Math.PI * spin * j / arr.length));
      num.add(n);
    }
    nums.push(num);
  }
  return nums;
};


/**
 * @param {!Array.<!org.haodev.epicycle.ComplexNumber>} arr
 * @return {!boolean}
 * @private
 */
org.haodev.epicycle.DiscreteFourierTransform.isPowerOf2_ = function(arr) {
  var len = arr.length;
  var cnt = 0;
  while (len > 0) {
    if (len & 1 != 0) {
      cnt++;
    }
    len >>= 1;
  }
  // If power of 2, only one 1
  return cnt == 1;
};


/**
 * @param {!number} n
 * @return {!number}
 * @private
 */
org.haodev.epicycle.DiscreteFourierTransform.nextPowerOf2_ = function(n) {
  var p = 1;
  while (p < n) {
    p <<= 1;
  }
  return p;
}


/**
 * @param {!Array.<org.haodev.epicycle.ComplexNumber>} pts
 * @param {!number} ind
 * @param {!number} n
 * @param {!number} s
 * @return {!Array.<!org.haodev.epicycle.ComplexNumber>}
 * Fast fourier transform of a series of points.
 */
org.haodev.epicycle.DiscreteFourierTransform.fft_ = function(pts, ind, n, s) {
  if (n == 1) {
    return [pts[ind].clone()];
  } else {
    var firstHalf = org.haodev.epicycle.DiscreteFourierTransform.fft_(pts, ind, n / 2, 2 * s);
    var secondHalf = org.haodev.epicycle.DiscreteFourierTransform.fft_(pts, ind + s, n / 2, 2 * s);
    var fullArr = [];

    for (var i = 0; i < n; i++) {
      if (i < n / 2) {
        fullArr.push(firstHalf[i]);
      } else {
        fullArr.push(secondHalf[i - n / 2]);
      }
    }

    for (var k = 0; k < n / 2; k++) {
      var wk = org.haodev.epicycle.ComplexNumber.from(1, -2 * Math.PI * k / n);
      var nforward1 = fullArr[k + n / 2].clone();
      nforward1.multiply(wk);
      var nforward2 = nforward1.clone();
      nforward2.negative();

      var t = fullArr[k].clone();
      fullArr[k].add(nforward1);
      t.add(nforward2);
      fullArr[k + n / 2] = t;
    }
    return fullArr;
  }
};
