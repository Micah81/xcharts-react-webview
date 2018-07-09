var React = require('react');
var Chart = require('./Chart');

// state
// lifecycle event
// UI

class App extends React.Component {
  render() {
    return (
      <div className='container'>
        <Chart />
      </div>
    )
  }
}

module.exports = App;
