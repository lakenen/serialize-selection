
// get a range for the current selection if there is one, otherwise create one
function getRange() {
  var sel = window.getSelection()
  if (sel.rangeCount) {
    return sel.getRangeAt(0)
  }
  return document.createRange()
}

// restore the selection specified by the given state and reference node, and
// return the new selection object
function restore(state, referenceNode) {
  referenceNode = referenceNode || document.body

  var i
    , node
    , nextNodeCharIndex
    , currentNodeCharIndex = 0
    , nodes = [referenceNode]
    , sel = window.getSelection()
    , range = document.createRange()

  range.setStart(referenceNode, 0)
  range.collapse(true)

  while (node = nodes.pop()) {
    if (node.nodeType === 3) { // TEXT_NODE
      nextNodeCharIndex = currentNodeCharIndex + node.length

      // if this node contains the character at the start index, set this as the
      // starting node with the correct offset
      if (state.start >= currentNodeCharIndex && state.start <= nextNodeCharIndex) {
        range.setStart(node, state.start - currentNodeCharIndex)
      }

      // if this node contains the character at the end index, set this as the
      // ending node with the correct offset and stop looking
      if (state.end >= currentNodeCharIndex && state.end <= nextNodeCharIndex) {
        range.setEnd(node, state.end - currentNodeCharIndex)
        break
      }

      currentNodeCharIndex = nextNodeCharIndex
    } else {

      // get child nodes if the current node is not a text node
      i = node.childNodes.length
      while (i--) {
        nodes.push(node.childNodes[i])
      }
    }
  }

  sel.removeAllRanges()
  sel.addRange(range)
  return sel
}

// serialize the current selection offsets using given node as a reference point
function save(referenceNode) {
  referenceNode = referenceNode || document.body

  var range = getRange()
    , startContainer = range.startContainer
    , startOffset = range.startOffset
    , state = { content: range.toString() }

  // move the range to select the contents up to the selection
  // so we can find its character offset from the reference node
  range.selectNodeContents(referenceNode)
  range.setEnd(startContainer, startOffset)

  state.start = range.toString().length
  state.end = state.start + state.content.length

  // add a shortcut method to restore this selection
  state.restore = restore.bind(null, state, referenceNode)

  return state
}

module.exports = {
  save: save,
  restore: restore
}
