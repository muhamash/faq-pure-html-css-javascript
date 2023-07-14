(function (window) {
  'use strict';

  // Utility function to create a regular expression for matching a class name
  function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  var hasClass, addClass, removeClass;

  // Check if the browser supports the classList property
  if ('classList' in document.documentElement) {
    // If supported, use classList methods for checking, adding, and removing classes
    hasClass = function (elem, c) {
      return elem.classList.contains(c);
    };
    addClass = function (elem, c) {
      elem.classList.add(c);
    };
    removeClass = function (elem, c) {
      elem.classList.remove(c);
    };
  } else {
    // If not supported, fallback to using regular expressions and manipulating the className property
    hasClass = function (elem, c) {
      return classReg(c).test(elem.className);
    };
    addClass = function (elem, c) {
      if (!hasClass(elem, c)) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function (elem, c) {
      elem.className = elem.className.replace(classReg(c), ' ');
    };
  }

  // Function for toggling a class on an element
  function toggleClass(elem, c) {
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
  }

  // Object containing class-related functions
  var classObjects = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // Check if AMD format is supported and define the classObjects module accordingly
  if (typeof define === 'function' && define.amd) {
    define(classObjects);
  } else {
    // If not using AMD, make the classObjects object available globally through the window object
    window.classObjects = classObjects;
  }
})(window);

// Shorthand function for selecting an element using a CSS selector
var $ = function (selector) {
  return document.querySelector(selector);
};

// Get the accordion element
var accordion = $('.accordion');

// Add a click event listener to the accordion element
accordion.addEventListener("click", function (e) {
  e.stopPropagation();
  e.preventDefault();

  if (e.target && e.target.nodeName == "A") {
    var classes = e.target.className.split(" ");
    if (classes) {
      for (var x = 0; x < classes.length; x++) {
        if (classes[x] == "accordionTitle") {
          // Find the title and content elements
          var title = e.target;
          var content = e.target.parentNode.nextElementSibling;

          // Toggle the 'accordionTitleActive' class on the title element
          classObjects.toggle(title, 'accordionTitleActive');

          // Toggle animations by adding or removing 'animateIn' and 'animateOut' classes on the content element
          if (classObjects.has(content, 'accordionItemCollapsed')) {
            if (classObjects.has(content, 'animateOut')) {
              classObjects.remove(content, 'animateOut');
            }
            classObjects.add(content, 'animateIn');
          } else {
            classObjects.remove(content, 'animateIn');
            classObjects.add(content, 'animateOut');
          }

          // Toggle the 'accordionItemCollapsed' class on the content element to expand or collapse it
          classObjects.toggle(content, 'accordionItemCollapsed');
        }
      }
    }
  }
});