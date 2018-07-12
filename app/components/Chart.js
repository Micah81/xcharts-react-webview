var React = require('react');
import ReactDOM from 'react-dom';
var PropTypes = require('prop-types');
var api = require('../utils/api');
import * as V from 'victory';
import { VictoryCandlestick } from 'victory';
var vars = require('../utils/robinhood/credentials')

var promise;
function TopStock(credentials) {
  return promise = new Promise(function(resolve, reject) {
    var Robinhood = require('robinhood')(credentials, function(){
        Robinhood.sp500_up(function(err, response, body){
            if(err){
                console.error(err);
            }else{
                //console.log("sp500_up");
                console.log("symbol: ",body.results[0].symbol);
                resolve(body.results[0].symbol)
                // Right here is where this data should be cached with Firebase db
            }
        })
    })
  })
}

function ChartRender (props) {
  return (
    <div>
    <VictoryCandlestick
      data= {props.chartData}
      xAccessor= {(d) => d.x}
      yAccessor= {(d) => d.y}
      interpolationType= 'linear'
      hoverAnimation= 'true'
    />
  </div>
  )
}

class Chart extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectedInstrument: null,
      chartData: null
    };

    this.updateInstrument = this.updateInstrument.bind(this);
  }

  componentDidMount() {
    this.updateInstrument(this.state.selectedInstrument)
    TopStock(vars.credentials).then( (result) => {
         this.setState({selectedInstrument: result})
         return result;
       }).then((result)=>{ // result is the symbol
         return(api.fetchChartData(result))
       }).then((result)=>{ // result is the data
         this.setState({chartData:result})
       })
}//end componentDidMount

  componentWillUnmount() {
    this.isCancelled = true;
}

  updateInstrument(instr) {
    this.setState(function () {
      return {
        selectedInstrument: instr
      }
    });

    api.fetchChartData(instr)
      .then(function (chartData) {
        this.setState(function () {
          return {
            chartData: chartData
          }
        });
      }.bind(this));
  }

  render() {
    return (
      <div>
          {console.log("chartdata: ",this.state.chartData)}
        {!this.state.chartData
          ? <p>LOADING!</p>
          : <ChartRender chartData={this.state.chartData } />}
      </div>
    )
  }
}

module.exports = Chart;
