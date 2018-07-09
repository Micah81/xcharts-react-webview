var React = require('react');
import ReactDOM from 'react-dom';
var PropTypes = require('prop-types');
var api = require('../utils/api');
import * as V from 'victory';
import { VictoryCandlestick } from 'victory';

const credentials = {
      username: '',
      password: ''
  }

  function TopStock(credentials){
    var Robinhood = require('robinhood')(credentials, function(){
        Robinhood.sp500_up(function(err, response, body){
            if(err){
                console.error(err);
            }else{
              // NEEDS a .then function .....
                //console.log("sp500_up");
                //console.log(body.results[0].symbol);
                return(body.results[0].symbol)
            }
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
      selectedInstrument: 'AMZN',
      chartData: null
    };

    this.updateInstrument = this.updateInstrument.bind(this);
  }



  componentDidMount() {
    this.updateInstrument(this.state.selectedInstrument)

    // use RH here to get a popular stock
this.updateInstrument(TopStock(credentials))
      //TopStock(credentials)

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
