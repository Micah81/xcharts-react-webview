var axios = require('axios');
var key = require('./apiKey')

var latestQuotes = [];
function getOpenPrice (period) {
  latestQuotes.push({
                     'open':   parseFloat(period['1. open']),
                     'high':   parseFloat(period['2. high']),
                     'low':    parseFloat(period['3. low']),
                     'close':  parseFloat(period['4. close'])//,
                     //'x':      period['']
                     //'x':      parseFloat(period['5. volume'])
                  });
}

module.exports = {
  fetchChartData: function (instrument) {
    var encodedURI = window.encodeURI('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + instrument + '&apikey=' + key);
    return(axios.get(encodedURI))
      .then(function (response){
        if(response.data.hasOwnProperty('Time Series (Daily)')) {
          var hash = response.data['Time Series (Daily)']
          var keys = Object.keys(hash)
          keys.forEach((key, i)=>{
            getOpenPrice((hash[key]))

          })
          //console.log(latestQuotes)
          //return(latestQuotes)
          return (
            latestQuotes.reverse()
          )
        }
      })
  }
}
