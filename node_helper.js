const NodeHelper = require('node_helper');
const request = require('request');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);

        requiresVersion: "2.1.0",

        this.bus_dict = {};
    },

    getRoute: function(raw_response){
        var rt = raw_response["rt"];
        return rt;
    },

    getStop: function(raw_response){
        var stpnm = raw_response["stpnm"];
        return stpnm;
    },

    getArrivalTime: function(raw_response){
        var prdtm = raw_response["prdtm"].slice(9);
        return prdtm;
    },

    getRemainingMinutes: function(raw_response){
        var prdctdn = raw_response["prdctdn"];
        return prdctdn;
    },
    
    getDirection: function(raw_response) {
        var rtdir = raw_response["rtdir"];
        return rtdir;
    },

    getDestination: function(raw_response) {
        var des = raw_response["des"];
        return des;
    },

    noBusInfo: function(bus, stop) {
        var result = {  "time": "N/A", "min": "N/A", 
                        "dir": "N/A", "dest": "N/A",
                        "bus": bus,
                        "stop": "ID: " + stop};
        return result;
    },
    
    getBusInfo: function(url, bus, stop) {
        var that = this;
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {

            var result = {};
            var busStopPair = bus+"-"+stop;
            
            if (!error && response.statusCode == 200) {
                    
                var raw_response = JSON.parse(body);

                if (raw_response.hasOwnProperty("bustime-response")) {
                    if (raw_response["bustime-response"].hasOwnProperty("prd")) {
                        
                        var data_to_pass_in = raw_response["bustime-response"]["prd"][0]
                        
                        result["bus"] = this.getRoute(data_to_pass_in);
                        result["stop"] = this.getStop(data_to_pass_in);
                        result["time"] = this.getArrivalTime(data_to_pass_in);
                        result["min"] = this.getRemainingMinutes(data_to_pass_in);
                        result["dir"] = this.getDirection(data_to_pass_in);
                        result["dest"] = this.getDestination(data_to_pass_in);
                        // console.log(result);
                        this.sendSocketNotification(busStopPair, result);
                    }
                    else {
                        console.log(this.name + ": unable to parse JSON response(prd)");
                        console.log(raw_response["bustime-response"]["error"]);
                        // console.log(raw_response["bustime-response"]["error"]["msg"]);
                        this.sendSocketNotification(busStopPair, this.noBusInfo(bus, stop));
                    }
                }
                else {
                    console.log(this.name + ": unable to parse JSON response(bustime-response)");
                    this.sendSocketNotification(busStopPair, this.noBusInfo(bus, stop));
                }
            }
            else {
                console.log(this.name + ": unable to connect to API, error msg is below: ");
                console.log(error);
                console.log(response);
                this.sendSocketNotification(busStopPair, this.noBusInfo(bus, stop));
            }
        });
    },


    // this makes a complete url for you using the bus and stop given
    makeURL: function(bus, stopid, key) {
        var url = "http://truetime.portauthority.org/bustime/api/v3/getpredictions?key=" + 
                  this.key + "&rt=" + bus + "&stpid=" + 
                  stopid +"&rtpidatafeed=Port Authority Bus&format=json";
        return url;
    },


    getBusFromPair: function(pair) {
        var i = pair.indexOf("-");
        return pair.slice(0,i);
    },


    getStopFromPair: function(pair) {
        var i = pair.indexOf("-");
        return pair.slice(i+1);
    },


    // this calls getBus to send individual bus data from api call to MMM-PGHBus.js
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_BUS') {
            this.key = payload["key"];
            this.busStopPairs = payload["busStopPairs"];
            var url = "";
            var thisBus = "";
            var thisStop = "";
            for (i = 0; i < this.busStopPairs.length; i ++) {
                thisBus = this.getBusFromPair(this.busStopPairs[i]);
                thisStop = this.getStopFromPair(this.busStopPairs[i]);
                url = this.makeURL(thisBus, thisStop);
                this.getBusInfo(url, thisBus, thisStop);
            };
        }
    }
});