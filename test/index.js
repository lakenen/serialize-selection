var tape = require('tape')
  , serializeSelection = require('..')

var html = '<p>hello, world!</p>'

// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
        return fn.apply(thisp, arguments);
    };
};

function create(tag) {
  return document.createElement(tag)
}

function remove(el) {
  el.parentNode.removeChild(el)
}

function insert(el, container) {
  container = container || document.documentElement
  container.appendChild(el)
}

function setup(fn) {
  var el = create('div')
  el.innerHTML = html
  insert(el)

  function teardown() {
    remove(el)
  }

  return function (t) {
    fn(t, el)
    teardown()
  }
}


function test(msg, fn) {
  tape(msg, setup(fn))
}

test('should save a selection correctly', function (t, el) {
  var sel = window.getSelection()
    , range = document.createRange()
    , node = el.querySelector('p').firstChild
    , state

  range.setStart(node, 1)
  range.setEnd(node, 4)
  sel.addRange(range)

  state = serializeSelection.save(el)

  t.equal(state.start, 1)
  t.equal(state.end, 4)
  t.equal(state.content, 'ell')
  t.end()
})

test('should restore a selection correctly', function (t, el) {
  var sel
    , range
    , node = el.querySelector('p').firstChild
    , state = { start: 1, end: 4 }

  sel = serializeSelection.restore(state, el)
  range = sel.getRangeAt(0)

  t.equal(range.startContainer, el.querySelector('p').firstChild)
  t.equal(range.endContainer, el.querySelector('p').firstChild)
  t.equal(range.startOffset, 1)
  t.equal(range.endOffset, 4)
  t.equal(range.toString(), 'ell')
  t.end()
})

test('should ignore text outside reference element', function (t, el) {
  var sel = window.getSelection()
    , range = document.createRange()
    , node
    , state

  el.innerHTML = '<div>stuff before reference el</div>' + el.innerHTML

  node = el.querySelector('p').firstChild
  range.setStart(node, 1)
  range.setEnd(node, 4)
  sel.addRange(range)

  state = serializeSelection.save(node)

  t.equal(state.start, 1)
  t.equal(state.end, 4)
  t.equal(state.content, 'ell')
  t.end()
})
