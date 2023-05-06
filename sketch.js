// Set up properties
const canvasWidth = 800;
const canvasHeight = 800;
const neuronRadius = 4;
const maxNeurons = 500;
const connectionThreshold = 100;
const connectionForce = 0.05;
const addNeuronInterval = 125; // in milliseconds
const activatedColor = 'magenta';
const deactivatedColor = 'cyan';
const connectionColor = 'white';
const minConnectionThreshold = neuronRadius * 20; // Add a minimum distance threshold

// Neuron class
class Neuron {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connections = [];
    this.activated = false;
  }

  display() {
    fill(this.activated ? activatedColor : deactivatedColor);
    noStroke();
    ellipse(this.x, this.y, neuronRadius * 2);
    stroke(connectionColor);
    this.connections.forEach((other) => {
      line(this.x, this.y, other.x, other.y);
    });
  }

  update(neurons) {
    this.applyMagneticForce(neurons);
  }

  applyMagneticForce(neurons) {
    neurons.forEach((other) => {
      if (other !== this) {
        let d = dist(this.x, this.y, other.x, other.y);

        // Magnetic force and connection
        if (d < connectionThreshold && d > minConnectionThreshold) {
          let force = connectionForce * (1 - d / connectionThreshold);
          let dirX = (other.x - this.x) * force;
          let dirY = (other.y - this.y) * force;

          this.x += dirX;
          this.y += dirY;

          // Create connection if not already connected
          if (!this.connections.includes(other)) {
            this.connections.push(other);
          }
        }
      }
    });
  }
  // Add a new method to check if the neuron is under the mouse cursor
  isUnderMouse() {
    return dist(this.x, this.y, mouseX, mouseY) < neuronRadius;
  }
}

// Global variables
let neurons = [];
let lastNeuronAdded = 0;
let draggingNeuron = null; // Track the neuron being dragged


// Set up the canvas
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  frameRate(60);
  neurons.push(new Neuron(width / 2, height / 2));
}

// Main draw loop
function draw() {
  background(0);

  // Add new neuron based on elapsed time
  if (millis() - lastNeuronAdded >= addNeuronInterval && neurons.length < maxNeurons) {
    let newX, newY, validPosition;
    do {
      newX = random(width);
      newY = random(height);
      validPosition = true;

      // Check for overlap with existing neurons
      neurons.forEach((neuron) => {
        if (dist(newX, newY, neuron.x, neuron.y) < neuronRadius * 2) {
          validPosition = false;
        }
      });
    } while (!validPosition);

    neurons.push(new Neuron(newX, newY));
    lastNeuronAdded = millis();
  }

  neurons.forEach((neuron) => {
    neuron.update(neurons);
    neuron.display();
  });
  // Update the dragged neuron's position to follow the mouse
  if (draggingNeuron) {
    draggingNeuron.x = mouseX;
    draggingNeuron.y = mouseY;
  }
}

// Mouse click event handler
function mouseClicked() {
  neurons.forEach((neuron) => {
    if (dist(mouseX, mouseY, neuron.x, neuron.y) < neuronRadius) {
      neuron.activated = !neuron.activated;
    }
  });
}


// Mouse press event handler
function mousePressed() {
  // Detect if the mouse is pressing down on a neuron and start dragging
  neurons.forEach((neuron) => {
    if (neuron.isUnderMouse()) {
      draggingNeuron = neuron;
    }
  });
}

// Mouse release event handler
function mouseReleased() {
  // Release the dragged neuron when the mouse is released
  draggingNeuron = null;
}







