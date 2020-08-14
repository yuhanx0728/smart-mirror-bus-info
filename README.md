# Project description
This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module displays real time Pittsburgh bus information from Port Authority for chosen bus routes and bus stops, including:
1. chosen bus route
2. arrival time
3. remaining minutes to arrival time
4. bus direction(inbound/outbound)
5. chosen bus stop(name)
6. bus destination

![Default screenshot](https://github.com/yuhanx0728/MMM-PGHBus/blob/master/default.png)
![Verbose screenshot](https://github.com/yuhanx0728/MMM-PGHBus/blob/master/verbose.png)

# Tech stack

Javascript, Node.js

# How to run on your Magic Mirror
1. Add MMM-PGHBus to your ```MagicMirror/modules``` directory
```
cd ~/MagicMirror/modules
git clone https://github.com/yuhanx0728/MMM-PGHBus/
cd MMM-PGHBus/
npm install
```
2. Configure your ```MagicMirror/config/congfig.js``` file
```
modules: [
    {
        module: 'MMM-PGHBus',
        position: 'top_left',
        config: {
            key: "",  // get developer API key from https://truetime.portauthority.org/bustime/home.jsp
            busStopPairs: [],       // add as many "bus-stopID"s as you want, e.g."71C-2573", "71A-2573", "71A-2633"; stopID can be found on Google Map
            useHeader: true,                   // optional, default true
            header: "When Do Buses Come",      // optional
            verbose: false,                    // optional, default false
            maxWidth: "450px",                 // optional, default 450px
            updateInterval: 45 * 1000,         // bus schedule update speed, optional, default 45s
            animationSpeed: 3000              // fade in & fade out speed, optional, default 3s
        }
    }
]
```
