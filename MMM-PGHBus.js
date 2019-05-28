Module.register("MMM-PGHBus", {

    // Module config defaults.
    defaults: {
        useHeader: true,           // false if you don't want a header
        header: "Pittsburgh Buses", 
        maxWidth: "450px",
        verbose: false,            // show destination and stop name/ID if true
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

        var table = document.createElement("table");
        table.classList.add("xsmall", "bright", "light");
        wrapper.appendChild(table);

        var tr = document.createElement("tr");
        table.appendChild(tr);

        var labels = ["Bus", "(min)", "  ", "    "];
        if (this.config.verbose != false) {
            var labels = ["Bus", "(min)", "  ", "    ", "Stop", "Dest"];
        }

        for (i = 0; i < labels.length; i ++) {
            var th = document.createElement("th");
            th.classList.add("xsmall", "bright");
            th.innerHTML = labels[i];
            tr.appendChild(th);
        };

        var keys = Object.keys(this.busStopPairDict);
        var newBus = null;

        // updating the HTML for each bus
        for (i = 0; i < keys.length; i ++) {
            
            var tr = document.createElement("tr");
            table.appendChild(tr);
            newBus = this.busStopPairDict[keys[i]];

            // bus from newBus
            var bus = document.createElement("td");
            bus.classList.add("xsmall", "bright", "bus");
            bus.innerHTML = newBus["bus"];
            tr.appendChild(bus);

            // remainingMinutes from newBus
            var remainingMinutes = document.createElement("td");
            remainingMinutes.classList.add("xsmall", "bright", "remainingMinutes");
            remainingMinutes.innerHTML = newBus["min"];
            tr.appendChild(remainingMinutes);

            // arrivalTime from newBus
            var arrivalTime = document.createElement("td");
            arrivalTime.classList.add("xsmall", "bright", "arrivalTime");
            arrivalTime.innerHTML = newBus["time"];
            tr.appendChild(arrivalTime);

            // direction from newBus
            var dir = document.createElement("td");
            dir.classList.add("xsmall", "bright", "dir");
            dir.innerHTML = newBus["dir"];
            tr.appendChild(dir);

            if (this.config.verbose != false) {
                // stop from newBus
                var stop = document.createElement("td");
                stop.classList.add("xsmall", "bright", "stop");
                stop.innerHTML = newBus["stop"];
                tr.appendChild(stop);

                // destination from newBus
                var dest = document.createElement("td");
                dest.classList.add("xsmall", "bright", "dest");
                dest.innerHTML = newBus["dest"];
                tr.appendChild(dest);
            }
          
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