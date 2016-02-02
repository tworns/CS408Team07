var Button = require('./node_modules/react-bootstrap').Button;
var ButtonToolbar = require('./node_modules/react-bootstrap').ButtonToolbar;
var ReactDOM = require('./node_modules/react-dom/dist/react-dom.js');

const buttonsInstance = (
  React.createElement(ButtonToolbar, null, 

      /* Indicates a successful or positive action */
      React.createElement(Button, {bsStyle: "success"}, "Correct!"), 

      /* Indicates a dangerous or potentially negative action */
      React.createElement(Button, {bsStyle: "danger"}, "Pass!"), 

      /* Contextual button for informational alert messages */
      React.createElement(Button, {bsStyle: "info"}, "Delete")

  )
);

var mountNode = document.getElementById('button area');

ReactDOM.render(buttonsInstance, mountNode);