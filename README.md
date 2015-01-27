# serialize-selection

Serialize and restore DOM Selections via text offset from a reference Node.

## Installation

```
npm install serialize-selection
```

## Usage

### save

`ss.save([referenceNode])`

#### Arguments

* `[referenceNode]` - (optional) a DOM `Element` used as the reference for serialization. *Default: `document.body`*.


#### Returns

`save` returns an object with the following properties:

* `start` - the start offset of the selection from the reference node
* `end` - the end offset of the selection from the reference node
* `restore` - shortcut method to restore the selection


### restore

`ss.restore(state, [referenceNode])`

#### Arguments

* `state` - a selection state object (any object with `start` and `end` properties).
* `[referenceNode]` - (optional) a DOM `Element` used as the reference for serialization. *Default: `document.body`*.


#### Returns

`restore` returns a Selection object


```js
var ss = require('serialize-selection')

var referenceEl = document.querySelector('.some-element')

var state = ss.save(referenceEl)
// state object with start/end properties

var sel = state.restore() // equivalent to ss.restore(state, referenceEl)
// selection is restored
```

## License

([The MIT License](LICENSE))

Copyright 2015 Cameron Lakenen
