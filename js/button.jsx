{/*aa*/}
var Button = require('./node_modules/react-bootstrap').Button;
var ButtonToolbar = require('./node_modules/react-bootstrap').ButtonToolbar;
var ReactDOM = require('./node_modules/react-dom/dist/react-dom.js');

const buttonsInstance = (
  <ButtonToolbar>

      {/* Indicates a successful or positive action */}
      <Button bsStyle="success">Correct!</Button>

      {/* Indicates a dangerous or potentially negative action */}
      <Button bsStyle="danger">Pass!</Button>

      {/* Contextual button for informational alert messages */}
      <Button bsStyle="info">Delete</Button>

  </ButtonToolbar>
);

var mountNode = document.getElementById('button area');

ReactDOM.render(buttonsInstance, mountNode);
