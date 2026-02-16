# Bellman-Ford Algorithm Visualizer

An interactive visualization of the Bellman-Ford shortest path algorithm.

This project was developed as part of Data Structures and Algorithms coursework to better understand how edge relaxation works and how negative weight cycles are detected.

---

## 🔗 Live Demo

https://krishsoni019.github.io/BellMan-Ford/

---

## Project Overview

The Bellman-Ford algorithm is a single-source shortest path algorithm that works on graphs with negative edge weights. Unlike Dijkstra's algorithm, it can also detect negative-weight cycles.

This visualizer allows users to:

- Step through each iteration of the algorithm
- Observe edge relaxation in real-time
- Track distance updates
- Detect negative-weight cycles

---

## Technologies Used

- HTML
- CSS (Dark Theme UI)
- JavaScript (Algorithm Implementation & Visualization)

---

## How It Works

1. Initialize all distances (source = 0, others = ∞)
2. Relax all edges (V - 1) times
3. Perform a final pass to check for negative cycles
4. Display updated distances after each step

---

## Academic Purpose

This project was built to strengthen understanding of:

- Graph algorithms
- Shortest path problems
- Edge relaxation concept
- Negative cycle detection
- Algorithm visualization techniques

---

## Author

Krish Soni  
Data Structures and Algorithms Coursework Project
