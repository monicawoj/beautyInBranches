import React, { Component } from 'react'
import { scaleOrdinal, scalePow } from 'd3-scale'
import { max, min } from 'd3-array'
import { select } from 'd3-selection'
import { stratify, hierarchy, tree} from 'd3-hierarchy'

class Grass extends React.Component {
    render() {
        const grassBladeWidth = 10;
        const totalBlades = this.props.size[0]/grassBladeWidth;
        const grassColor = 'DarkSeaGreen';
        const grassStyle = {
            width:`${this.props.size[0]}px`,
            height:`10px`,
            background:grassColor,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        };
        let grassTriangles = [];
        for (let i=0; i<totalBlades; i++) {
            const max = 20;
            const min = -20;
            const randomSkew = Math.floor(Math.random() * (max - min + 1) + min);
            const triangleStyle = {
                width: 0,
                height: 0,
                border: `solid ${grassBladeWidth/2}px`,
                borderColor: `transparent transparent ${grassColor} transparent`,
                transform: `translate(0,-${grassBladeWidth}px) skewX(${randomSkew}deg)`,
            };

            grassTriangles.push(<div key={i} className='grass-triangle' style={triangleStyle}/>)
        }

        return <div style={grassStyle}>
            {grassTriangles}
        </div>;
    }
}

class D3Tree extends React.Component {
    componentDidMount() {
        this.createTree();
    }

    componentDidUpdate() {
        this.createTree();
    }

    createTree() {
        const {data} = this.props;

        const treeData = stratify()
            .id(function(d) { return d.child; })
            .parentId(function(d) { return d.parent; })
            (data);



        treeData.each(function(d) {
            d.name = d.id;
            d.cleanName = cleanName(d.id);
        });

            // set the dimensions and margins of the diagram
        this.width = this.props.size[0] - this.props.margin.left - this.props.margin.right;
        this.height = this.props.size[1] - this.props.margin.top - this.props.margin.bottom;

        //  assigns the data to a hierarchy using parent-child relationships
        const root = hierarchy(treeData, function(d) {
            return d.children;
        });

        // color scale for nodes and links based on surname
        let surnameList = [];
        root.each(function(d) {
            let surname = d.data.data.surname;
            if (surnameList.indexOf(surname)<0) {
                surnameList.push(surname);
            }
        });

        // create color hue scale based on total amount of leaves (nodes with no children)
        const hueDistance = Math.floor(360/surnameList.length);
        let colorHues = [];
        for (let i=0; i<surnameList.length; i++) {
            colorHues.push(`${hueDistance*(i+1)}`);
        };

        const colorHueScale = scaleOrdinal().domain(surnameList).range(colorHues);

        // declares a tree layout and assigns the size, with node data, creates inner g for margins
        const treemap = tree().size([this.width, this.height]);
        treemap(root);
        const g = this.g;

        // depth scales for link and color lightness styling
        const maxDepth = max(root.descendants().map(d => d.depth));
        const minDepth = min(root.descendants().map(d => d.depth));
        const depthScale = scalePow().domain([minDepth,maxDepth]);
        const initialNodeSize = 3;

        //add links between nodes
        const link = select(g)
            .selectAll(".link")
            .data( root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr('id', d => `${d.data.id}-${d.parent.data.id}`)
            .attr("d", function(d) {
                return "M" + (d.x) + "," + (-d.y)
                    + "C" + (d.x) + "," + ((-d.y - d.parent.y)) / 2
                    + " " + (d.parent.x) + "," + ((-d.y - d.parent.y)) / 2
                    + " " + (d.parent.x) + "," + (-d.parent.y);
            });

        link.style("fill","none")
            .style("stroke", function(d) {
                    return `hsl(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%)`;
            })
            .style("stroke-width", d => `${depthScale.range([10,2])(d.depth)}px`);

        // adds each node + event listeners
        const node = select(g).selectAll(".node");
        node.data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                if (d.parent) {
                    return d.children ? 'node node--internal' : 'node node--leaf';
                } else {
                    return d.children ? 'node node--internal node--root' : 'node node--leaf node--root';
                }
            })
            .attr("id", d => `${d.data.id}`)
            .attr("transform", function(d) {
                return "translate(" + (d.x) + "," + (-d.y) + ")";
            })
            .on("click", handleNodeClick)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        //styling for nodes
        node.append("circle")
            .attr("class", "node-circle")
            .attr("r", initialNodeSize)
            .style("fill", 'white')
            .style("stroke", function(d) {
                if (d.parent) {
                    return `hsl(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%)`;
                } else {
                    return 'black';
                }
            })
            .style("stroke-width","2px");

        //add line from bottom node for "trunk" of tree
        select(g)
            .selectAll('.node--root')
            .append("text")
            .attr("dy", ".35em")
            .attr("y", 0)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .text(d => d.data.data.surname)
            .style("font","12px sans-serif")
            .style("color","brown");

        function handleMouseOver(d) {
            let thisNode = select(this);
            thisNode.select(".node-circle").style("r", initialNodeSize*2);
            thisNode.append("text")
                .attr("dy", ".35em")
                .attr("y", -13)
                .classed('node-text', true) // class used to remove additional text later
                .style("text-anchor", "middle")
                .text(function(d) { return d.data.cleanName; })
                .style("font","12px sans-serif")
                .style("color","black")
                .style("background","white");

            const selectedAncestors = d.ancestors();
            showAncestorPath(selectedAncestors);
        }

        function handleMouseOut() {
            let thisNode = select(this);
            thisNode.select(".node-circle").style("r", function() {
                if (select(this.parentNode).classed('node--focus')===false) {
                    return initialNodeSize;
                } else {
                    return initialNodeSize*2;
                }
            });
            thisNode.select('text.node-text').remove();

            resetLinkStyling();
        }

        function handleNodeClick(d) {
            let thisNode = select(this);
            select(this.parentNode).selectAll('.node').classed('node--focus', false);
            const circles = select(this.parentNode).selectAll('.node-circle');
            const links = select(this.parentNode).selectAll('.link');
            circles
                .style('r',initialNodeSize);

            links
                .style('stroke',function(d) {
                    return `hsla(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%,1)`;
                });

            thisNode
                .classed('node--focus', thisNode.classed("node--focus") ? false : true)
                .select('.node-circle')
                .style('r', function() {
                    if (select(this.parentNode).classed('node--focus')) {
                        return initialNodeSize*2;
                    } else {
                        return initialNodeSize;
                    }
                });

            const selectedAncestors = d.ancestors();
            showAncestorPath(selectedAncestors);
        }

        function showAncestorPath(selectedAncestors) {
            let linkIds = [];
            selectedAncestors.forEach(function(node) {
                if (node.parent) {
                    linkIds.push(`${node.data.id}-${node.parent.data.id}`);
                }
            });

            select(g)
                .selectAll(".link")
                .style("fill","none")
                .style("stroke", function(d) {
                    if (linkIds.indexOf(this.id) < 0) {
                        return `hsla(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%,0.2)`;
                    } else {
                        return `hsla(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%,1)`;
                    }
                    });
        }

        function resetLinkStyling() {
            select(g)
                .selectAll('.link')
                .style("fill","none")
                .style("stroke", function(d) {
                    return `hsl(${colorHueScale(d.data.data.surname)},${depthScale.range([70,80])(d.depth)}%,${depthScale.range([0,80])(d.depth)}%)`;
                })
                .style("stroke-width", d => `${depthScale.range([10,2])(d.depth)}px`);
        }

        function cleanName(name) {
            if (name.indexOf("-")===0) {
                name = name.substring(1);
            }
            if (name.indexOf("-")===(name.length-1)) {
                name = name.substring(0,name.length-1);
            }
            return name;
        }

    }

    render() {
        return <div style={{width:`${this.props.size[0]}px`, height:`${this.props.size[1]}px`}}>
            <svg style={{width:`${this.props.size[0]}px`, height:`${this.props.size[1]}px`}}>
                <g ref={g => this.g = g} style={this.props.treeStyle}/>
            </svg>
            <Grass size={this.props.size}/>
            <div style={{width:`${this.props.size[0]}px`, height:`50px`, background:`BurlyWood`}}/>
        </div>
    }
}

export default D3Tree;