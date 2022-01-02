# Nikola Gauge

Proof of concept animated realtime circular gauge written in Typescript.

![Gauge animation example](/nikola.webp)

## Features

- Configurable minimum and maximum, target range, font, background, size, label, and colors
- Circular bar graph showing realtime value
- Line graph showing historical values
- Target range highlighted on bar and line graphs
- Line and bar graph colors change when inside or outside target range

# Demo

https://coreyshuman.github.io/nikola-guage/dist

The demo currently shows two gauges using different size canvas and different configurations for range and target. The ring becomes red if the value is under target, and green when over. The historical line graph is green when within target and red when outside target range.  

# Running the Project

1. Install dependencies - `yarn`
1. Build and Serve - `yarn run serve`
1. Visit - `http://127.0.0.1:8080`
