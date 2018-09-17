# Nikola Gauge
Proof of concept gauge for upcoming projects.

2. Install dependencies - `yarn`
3. Build and Serve - `yarn run serve`
5. Visit - `http://127.0.0.1:8080`


Demo currently shows two gauges using different size canvas and different configurations.  
Mockup image is included for reference.


## Files
- gauge.js - the primary gauge logic
- canvas.js - middleware for necessary canvas functions
- driver.js - the api implementation for canvas functionality. This will change depending on platform. Current platform support is HTML5 canvas.