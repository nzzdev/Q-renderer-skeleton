const JsDom = require('jsdom');
const expect = require('chai').expect;

const mockData = require('./resources/mock-data');
require('svelte/ssr/register');
const staticTpl = require('../views/html-static.html');
var markup = staticTpl.render(JSON.parse(JSON.stringify(mockData)));


function element(selector) {
  return new Promise((resolve, reject) => {
    JsDom.env(
      markup,
      (err, window) => {
        resolve(window.document.querySelector(selector));
      })
  })
}

function elementCount(selector) {
  return new Promise((resolve, reject) => {
    JsDom.env(
      markup,
      (err, window) => {
        resolve(window.document.querySelectorAll(selector).length);
      })
  })
}

// some basic dom tests with mock data
describe('Q election votes dom tests', function() {
  it('should pass if sum of values is found', function() {
    return elementCount('div.renderer-sum').then(value => {
        expect(value).to.be.equal(1);
    })
  })

  it('should pass if for each sample data entry a DOM element is created', function() {
    return elementCount('div.renderer-data-entry').then(value => {
      expect(value).to.be.equal(mockData.sampleData.length);
    })
  })
})
