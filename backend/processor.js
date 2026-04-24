/**
 * Processes hierarchical node relationships and returns structured output.
 */
function processHierarchies(data) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const valid_edges = [];
    const seen_edges = new Set();

    // 1. Validation & Duplicates
    data.forEach(entry => {
        const trimmed = entry.trim();
        const match = trimmed.match(/^([A-Z])->([A-Z])$/);

        if (!match) {
            invalid_entries.push(trimmed);
            return;
        }

        const [_, parent, child] = match;

        if (parent === child) {
            invalid_entries.push(trimmed);
            return;
        }

        if (seen_edges.has(trimmed)) {
            if (!duplicate_edges.includes(trimmed)) {
                duplicate_edges.push(trimmed);
            }
            return;
        }

        seen_edges.add(trimmed);
        valid_edges.push({ parent, child });
    });

    // 2. Graph Construction & Multi-parent handling
    const adj = {};
    const hasParent = new Set();
    const nodes = new Set();
    const parentCount = {};

    valid_edges.forEach(({ parent, child }) => {
        nodes.add(parent);
        nodes.add(child);

        if (!parentCount[child]) {
            parentCount[child] = 0;
        }
        if (!parentCount[parent]) {
            parentCount[parent] = 0;
        }

        // Multi-parent: Keep first occurrence, ignore later ones
        if (parentCount[child] === 0) {
            if (!adj[parent]) adj[parent] = [];
            adj[parent].push(child);
            hasParent.add(child);
            parentCount[child]++;
        }
    });

    // 3. Identify Roots
    let roots = Array.from(nodes).filter(node => !hasParent.has(node));
    
    // If no roots (cycle), choose lexicographically smallest node
    if (roots.length === 0 && nodes.size > 0) {
        roots = [Array.from(nodes).sort()[0]];
    }
    roots.sort();

    const hierarchies = [];
    let total_cycles = 0;

    // 4. Tree Building, Cycle Detection & Depth
    roots.forEach(root => {
        const visited = new Set();
        const recursionStack = new Set();
        let hasCycle = false;

        function buildTree(node) {
            if (recursionStack.has(node)) {
                hasCycle = true;
                return {};
            }
            if (visited.has(node)) return null; // Already processed in this tree context

            visited.add(node);
            recursionStack.add(node);

            const tree = {};
            const children = (adj[node] || []).sort();
            
            children.forEach(child => {
                const childSubtree = buildTree(child);
                if (childSubtree !== null) {
                    tree[child] = childSubtree;
                }
            });

            recursionStack.delete(node);
            return tree;
        }

        function getTreeStats(node, currentTree) {
            let maxD = 1;
            let nodeCount = 1;

            for (const child in currentTree) {
                const stats = getTreeStats(child, currentTree[child]);
                maxD = Math.max(maxD, 1 + stats.depth);
                nodeCount += stats.count;
            }

            return { depth: maxD, count: nodeCount };
        }

        const treeStructure = buildTree(root);

        if (hasCycle) {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            const stats = getTreeStats(root, treeStructure);
            hierarchies.push({
                root,
                tree: { [root]: treeStructure },
                has_cycle: false,
                depth: stats.depth,
                nodes: stats.count
            });
        }
    });

    // 5. Summary Object
    let largest_tree_root = "";
    let max_depth = -1;

    hierarchies.forEach(h => {
        if (!h.has_cycle) {
            if (h.depth > max_depth) {
                max_depth = h.depth;
                largest_tree_root = h.root;
            } else if (h.depth === max_depth) {
                if (!largest_tree_root || h.root < largest_tree_root) {
                    largest_tree_root = h.root;
                }
            }
        }
    });

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees: hierarchies.filter(h => !h.has_cycle).length,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processHierarchies };
