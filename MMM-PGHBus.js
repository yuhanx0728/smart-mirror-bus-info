Module.register("MMM-PGHBus", {

    // Module config defaults.
    defaults: {
        useHeader: true,           // false if you don't want a header
        header: "Pittsburgh Buses", 
        maxWidth: "250px",
        key: null,
        busStopPairs: [],          // an array of "bus-stopId", e.g. "61D-8789"
        updateInterval: 45 * 1000, // update speed in ms
        animationSpeed: 3000,      // fade in and out speed
    },

    getStyles: function() {
        return ["MMM-PGHBus.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        this.busStopPairDict = {};
        this.bus = null;
        this.getBuses();       // set intervals for bus schedule to update
    },


    getDom: function() {

        // creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // loading
        if (!this.loaded) {
            wrapper.innerHTML = "Finding buses . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        // creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var grid = document.createElement("div");
        grid.classList.add("xsmall", "bright", "light", "grid", "grid-container");
        wrapper.appendChild(grid);
      
        var keys = Object.keys(this.busStopPairDict);
        var newBus = null;

        // updating the HTML for each bus
        for (i = 0; i < keys.length; i ++) {
            
            newBus = this.busStopPairDict[keys[i]];

            var bus = document.createElement("div");
            bus.classList.add("xsmall", "bright", "grid-item", "bus");
            bus.innerHTML = newBus["bus"];
            grid.appendChild(bus);

            // bus from data
            var stop = document.createElement("div");
            stop.classList.add("xsmall", "bright", "grid-item", "stop");
            stop.innerHTML = newBus["stop"];
            grid.appendChild(stop);

            // direction-destination from data
            var dirDes = document.createElement("div");
            dirDes.classList.add("xsmall", "bright", "grid-item", "direction-destination");
            dirDes.innerHTML = newBus["dir"] + " - "+ newBus["des"];
            grid.appendChild(dirDes);
        
            // arrivalTime from data
            var arrivalTime = document.createElement("div");
            arrivalTime.classList.add("xsmall", "bright", "grid-item", "arrivalTime");
            arrivalTime.innerHTML = "Predicted Arrival Time: " + newBus["time"];
            grid.appendChild(arrivalTime);
          
            // remainingMinutes from data
            var remainingMinutes = document.createElement("div");
            remainingMinutes.classList.add("xsmall", "bright", "grid-item", "remainingMinutes");
            remainingMinutes.innerHTML = newBus["min"] + " minutes remaining";
            grid.appendChild(remainingMinutes);

        };

        return wrapper;
    
    }, // <-- closes the getDom function from above


    // update the corresponding bus info in the busStopPairDict
    updateBuses: function(busStopPair, data) {
        this.busStopPairDict[busStopPair] = data;
        this.loaded = true;
    },
  

    // this asks node_helper for data
    getBuses: function() {
        console.log("getBus envoked!");
        payload = { "busStopPairs": this.config.busStopPairs, 
                    "key": this.config.key }
        this.sendSocketNotification('GET_BUS', payload);
    },
  
  
    // this gets individual bus data from node_helper
    socketNotificationReceived: function(busStopPair, payload) { 
        Log.info("RECEIVED!!");
        Log.info(busStopPair+payload);
        Log.info(busStopPair == this.config.busStopPairs[0]);
        if (this.config.busStopPairs.includes(busStopPair)) {
            Log.info("also we are here");
            this.updateBuses(busStopPair, payload);
            this.updateDom(this.config.animationSpeed);
        }
    },
});