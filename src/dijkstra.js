class dijkstra {
    constructor(graph = {}) {
        this.graph = graph;
        this.length = Object.keys(this.graph).length;
        this.nodes  = {};
        this.path   = [];
    }
    

    exec(start, end) {
        this.nodes[start] = {weight : 0, prev : null};
        this.end = end

        this.findNode();

        let previous = this.nodes[this.end].prev;
        let path = [this.end,previous];
        while(previous != start) {
            previous = this.nodes[previous].prev;
            path.push(previous);
        }

        return path.reverse();
    }

    findNode()
    {
        if(this.path.length == this.length) {
            return;
        }

        let smaller = Infinity
        let smallerNode;
        for(const key in this.nodes) {
            if(this.nodes[key].weight < smaller && !this.path.includes(key)) {
                smaller = this.nodes[key].weight;
                smallerNode = key
            }
        }

        const search = {
            graph : this.graph[smallerNode],
            node  : this.nodes[smallerNode]
        };

        for(const key in search.graph) {
            if(this.path.includes(key))
            {
                continue;
            }

            const weight = search.node.weight + search.graph[key]
            const prev   = smallerNode;
            if(this.nodes[key] != null) {
                if(weight < this.nodes[key].weight) {
                    this.nodes[key] = {weight: weight, prev: prev}
                }
            }
            else {
                this.nodes[key] = {weight: weight, prev: prev}
            }
        }

        this.path.push(smallerNode);
        this.findNode();
    }
}

module.exports = dijkstra;