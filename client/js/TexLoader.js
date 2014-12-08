goog.provide('haodev.tex');


/**
 * Converts all <eq> tags into latex expressions. It takes the calculated font
 * size of the <eq> tag.
 * @param {Element=} container Only look inside this element, if provided.
 */
haodev.tex.convertEquations = function(container) {
  var elements = goog.dom.getElementsByTagNameAndClass('eq', null, container);
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var formula = goog.dom.getTextContent(element).trim();
    var fontSizeString = window.getComputedStyle(element).fontSize;
    var fontSize = fontSizeString.substring(0, fontSizeString.length - 2);
    var imageTag = haodev.tex.equation(formula, fontSize);
    imageTag.onload = goog.bind(haodev.tex.onLoaded_, imageTag, element);
    goog.dom.insertSiblingAfter(imageTag, element);
  }
};


/** @type {string} */
haodev.tex.path_ = 'http://texloader.herokuapp.com/tex?';


/**
 * Builds an <img> tag out of the given formula and size.
 * @param {string} formula
 * @param {number|string} fontSize
 * @return {!Element}
 */
haodev.tex.equation = function(formula, fontSize) {
  var query = 'formula=' + encodeURIComponent(formula) + '&size='
      + encodeURIComponent(String(fontSize));
  return goog.dom.createDom('img', {
    'className': 'tex-img',
    'src': haodev.tex.path_ + query
  });
};


/**
 * Called when an image is loaded.
 * @param {!Element} eqElement
 * @private
 */
haodev.tex.onLoaded_ = function(eqElement) {
  goog.dom.removeNode(eqElement);
};
