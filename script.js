
    // Graph definition: 5 nodes (A, B, C, D, E)
    const graph = {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 2 },
            { from: 'B', to: 'C', weight: 1 },
            { from: 'B', to: 'D', weight: 5 },
            { from: 'C', to: 'D', weight: 8 },
            { from: 'C', to: 'E', weight: 10 },
            { from: 'D', to: 'B', weight: -4 },
            { from: 'E', to: 'D', weight: 2 },
        ],
    };

    // Node positions for SVG rendering
    const nodePositions = {
        A: { x: 80, y: 150 },
        B: { x: 180, y: 100 },
        C: { x: 180, y: 200 },
        D: { x: 300, y: 150 },
        E: { x: 350, y: 250 },
    };

    // State management
    let state = {
        distances: {},
        iteration: 0,
        phase: 'initialization', // 'initialization', 'relaxation', 'cycle-check', 'complete'
        isRunning: false,
        relaxingEdges: [],
        hasNegativeCycle: false,
        edgeIndex: 0,
    };

    // Initialize algorithm state
    function initializeAlgorithm() {
        state.distances = {};
        graph.nodes.forEach(node => {
            state.distances[node] = node === 'A' ? 0 : Infinity;
        });
        state.iteration = 0;
        state.phase = 'initialization';
        state.isRunning = false;
        state.relaxingEdges = [];
        state.hasNegativeCycle = false;
        state.edgeIndex = 0;
        
        updateUI();
        drawGraph();
    }

    // Start the algorithm
    function startAlgorithm() {
        if (!state.isRunning) {
            initializeAlgorithm();
            state.isRunning = true;
            document.getElementById('btn-start').disabled = true;
            document.getElementById('btn-next').disabled = false;
            updateUI();
        }
    }

    // Execute next step
    function nextStep() {
        if (!state.isRunning || state.phase === 'complete') return;

        if (state.phase === 'initialization') {
            // Move to relaxation phase
            state.phase = 'relaxation';
            state.edgeIndex = 0;
        } else if (state.phase === 'relaxation') {
            // Relax one edge
            if (state.edgeIndex < graph.edges.length) {
                const edge = graph.edges[state.edgeIndex];
                const u = edge.from;
                const v = edge.to;
                const weight = edge.weight;

                state.relaxingEdges = [`${u}-${v}`];

                // Relax the edge
                if (state.distances[u] !== Infinity && state.distances[u] + weight < state.distances[v]) {
                    state.distances[v] = state.distances[u] + weight;
                }

                state.edgeIndex++;

                // Check if we finished all edges
                if (state.edgeIndex >= graph.edges.length) {
                    state.iteration++;
                    state.edgeIndex = 0;

                    // Check if we completed V-1 iterations
                    if (state.iteration >= graph.nodes.length - 1) {
                        state.phase = 'cycle-check';
                    }
                }
            }
        } else if (state.phase === 'cycle-check') {
            // Check for negative cycles
            state.relaxingEdges = [];
            let foundNegativeCycle = false;

            graph.edges.forEach(edge => {
                const u = edge.from;
                const v = edge.to;
                const weight = edge.weight;

                if (state.distances[u] !== Infinity && state.distances[u] + weight < state.distances[v]) {
                    foundNegativeCycle = true;
                }
            });

            state.hasNegativeCycle = foundNegativeCycle;
            state.phase = 'complete';
        }

        updateUI();
        drawGraph();
    }

    // Reset algorithm
    function resetAlgorithm() {
        initializeAlgorithm();
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-next').disabled = true;
    }

    // Update UI elements
    function updateUI() {
        // Update iteration counter
        document.getElementById('iteration-count').textContent = 
            `${state.iteration} / ${graph.nodes.length - 1}`;

        // Update step type
        let stepText = '';
        if (state.phase === 'initialization') {
            stepText = 'Initializing distances...';
        } else if (state.phase === 'relaxation') {
            stepText = `Relaxation Pass ${state.iteration + 1}`;
        } else if (state.phase === 'cycle-check') {
            stepText = 'Checking for negative cycles...';
        } else {
            stepText = 'Complete';
        }
        document.getElementById('step-type').textContent = stepText;

        // Update status
        let statusLabel = 'Running...';
        if (state.phase === 'complete') {
            if (state.hasNegativeCycle) {
                statusLabel = 'Negative Cycle Detected';
            } else {
                statusLabel = 'Algorithm Complete';
            }
        }
        document.getElementById('status-label').textContent = statusLabel;

        // Update distance table with animation
        graph.nodes.forEach(node => {
            const distElement = document.getElementById(`dist-${node}`);
            const newValue = state.distances[node] === Infinity ? '∞' : state.distances[node];
            
            if (distElement.textContent !== newValue) {
                distElement.textContent = newValue;
                distElement.classList.add('updated');
                setTimeout(() => distElement.classList.remove('updated'), 600);
            }
        });

        // Update status message
        const statusMsg = document.getElementById('status-msg');
        if (state.phase === 'complete') {
            statusMsg.classList.add('active');
            if (state.hasNegativeCycle) {
                statusMsg.className = 'status-message active warning';
                statusMsg.textContent = '⚠️ Negative-weight cycle detected! Shortest paths are undefined.';
            } else {
                statusMsg.className = 'status-message active success';
                statusMsg.textContent = '✓ Algorithm complete. No negative cycles found. Shortest paths are valid.';
            }
            document.getElementById('btn-next').disabled = true;
        } else {
            statusMsg.classList.remove('active');
            document.getElementById('btn-next').disabled = false;
        }
    }

    // Draw the graph
    function drawGraph() {
        const svg = document.getElementById('algorithm-graph');
        
        // Clear previous content (keep defs)
        const defs = svg.querySelector('defs');
        svg.innerHTML = '';
        svg.appendChild(defs);

        // Draw edges
        graph.edges.forEach(edge => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            const isRelaxing = state.relaxingEdges.includes(`${edge.from}-${edge.to}`);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromPos.x);
            line.setAttribute('y1', fromPos.y);
            line.setAttribute('x2', toPos.x);
            line.setAttribute('y2', toPos.y);
            line.setAttribute('stroke', isRelaxing ? '#fbbf24' : '#2a3a52');
            line.setAttribute('stroke-width', isRelaxing ? '3' : '2');
            line.setAttribute('marker-end', isRelaxing ? 'url(#arrow-relax)' : 'url(#arrow)');
            svg.appendChild(line);

            // Weight label
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2 - 15;

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#a0aabe');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });

        // Draw nodes
        graph.nodes.forEach(node => {
            const pos = nodePositions[node];

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '25');
            circle.setAttribute('fill', '#1a2332');
            circle.setAttribute('stroke', '#00d4ff');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);

            // Node label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dy', '0.3em');
            label.setAttribute('font-size', '16');
            label.setAttribute('font-weight', 'bold');
            label.setAttribute('fill', '#00d4ff');
            label.textContent = node;
            svg.appendChild(label);

            // Distance label below node
            const distValue = state.distances[node] === Infinity ? '∞' : state.distances[node];
            const distLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            distLabel.setAttribute('x', pos.x);
            distLabel.setAttribute('y', pos.y + 40);
            distLabel.setAttribute('text-anchor', 'middle');
            distLabel.setAttribute('font-size', '11');
            distLabel.setAttribute('fill', '#a0aabe');
            distLabel.textContent = `d=${distValue}`;
            svg.appendChild(distLabel);
        });
    }

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', () => {
        initializeAlgorithm();
    });
