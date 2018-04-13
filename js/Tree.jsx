import React, { Component } from 'react'
import { scaleOrdinal, scalePow } from 'd3-scale'
import { max, min } from 'd3-array'
import { hierarchy, tree} from 'd3-hierarchy'
import Grass from './Grass.jsx'

class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: -1,
            data: this.props.data,
        }
    }

    generateTrunk = (node) => {
        const trunkStyle = {
            y: node.y,
            x: node.x,
            dy: '.35em',
            transform: 'translate(-4px,4px) rotate(90deg)',
            textAnchor: 'start',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            font: '12px sans-serif',
            fill: 'black',
        };

        if (node.depth === 0) {
            return <text textLength={this.margin.bottom/2} style={trunkStyle}>{node.data.surname}</text>;
        }
    };

    handleMouseOver = (e,node) => {
        //this = D3Tree, node = target node data, e.target = the circle that is moused over
        const target = e.target;
        target.parentNode.querySelector('text').style.display = 'block';
        target.style.r = this.initialNodeSize*2;

        const selectedAncestors = node.ancestors();
        selectedAncestors.forEach((node) => {
            if (node.parent) {
                node.data.status = true;
            }
        });

        this.setState({
            opacity: 0.2,
        });
        this.generateLinks(this.state.opacity);
    };

    handleMouseOut = (e,node) => {
        if (!node.data.clicked) {
            const target = e.target;
            target.parentNode.querySelector('text').style.display = 'none';
            target.style.r = this.initialNodeSize;

            const selectedAncestors = node.ancestors();
            selectedAncestors.forEach((node) => {
                if (node.parent) {
                    node.data.status = false;
                }
            });

            this.setState({
                opacity: 1,
            });
            this.generateLinks(this.state.opacity);
        }
    };

    handleNodeClick = (e,node) => {
        const target = e.target;
        target.parentNode.querySelector('text').style.display = 'block';
        target.style.r = this.initialNodeSize*2;

        const selectedAncestors = node.ancestors();
        selectedAncestors.forEach((node) => {
            if (node.parent) {
                node.data.clicked = !node.data.clicked;
            }
        });

        this.setState({
            opacity: 0.2,
        });
        this.generateLinks(this.state.opacity);

        this.props.handleNodeClickInApp(node);
    };

    generateLinks = (opacity) => {
        const linkData = this.root.descendants().slice(1);
        const initialLinkStyle = (node) => {
            let strokeStyle;
            if (node.data.status === true) {
                strokeStyle = `hsla(${this.colorHueScale(node.data.surname)},${this.depthScale.range([70, 80])(node.depth)}%,${this.depthScale.range([0, 80])(node.depth)}%,1)`;
            } else {
                strokeStyle = `hsla(${this.colorHueScale(node.data.surname)},${this.depthScale.range([70, 80])(node.depth)}%,${this.depthScale.range([0, 80])(node.depth)}%,${opacity})`;
            }
            return {
                fill: 'none',
                stroke: strokeStyle,
                strokeWidth: `${this.depthScale.range([10, 2])(node.depth)}px`,
            }
        };

        const links = linkData.map((node) => {
            return <path className={`link ${node.data.surname}`}
                         key={`${node.data.id}`}
                         id={`${node.data.id}`}
                         style={initialLinkStyle(node)}
                         d={`M${node.x},${-node.y} C${node.x},${(-node.y - node.parent.y)/2} ${node.parent.x},${((-node.y - node.parent.y)) / 2} ${(node.parent.x)},${-node.parent.y}`}>
            </path>});

        return links;
    };

    createTree = (data) => {
        this.initialNodeSize = 3;

        this.margin = {
            top: this.props.size[1]*0.1,
            left: this.props.size[0]*0.1,
            right: this.props.size[0]*0.1,
            bottom: this.props.size[1]*0.2,
        };

        // set the dimensions and margins of the diagram
        this.width = this.props.size[0] - this.margin.left - this.margin.right;
        this.height = this.props.size[1] - this.margin.top - this.margin.bottom;

        //  assigns the data to a hierarchy using parent-child relationships
        this.root = hierarchy(data, function(d) {
            return d.children;
        });

        // color scale for nodes and links based on surname
        let surnameList = [];
        this.root.each(function(d) {
            let surname = d.data.surname;
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

        this.colorHueScale = scaleOrdinal().domain(surnameList).range(colorHues);

        // declares a tree layout and assigns the size, with node data, creates inner g for margins
        const treemap = tree().size([this.width, this.height]);
        treemap(this.root);

        // depth scales for link and color lightness styling
        const maxDepth = max(this.root.descendants().map(d => d.depth));
        const minDepth = min(this.root.descendants().map(d => d.depth));
        this.depthScale = scalePow().domain([minDepth,maxDepth]);

        this.links = this.generateLinks(1);

        //add nodes
        const nodeData = this.root.descendants();
        function initialNodeStyle(node) {
            return {
                transform: `translate(${node.x}px,${-node.y}px)`
            }
        }
        const initialNodeCircleStyle = (node) => {
            return {
                r: this.initialNodeSize,
                fill: 'white',
                stroke: (node.parent) ? `hsl(${this.colorHueScale(node.data.surname)},${this.depthScale.range([70,80])(node.depth)}%,${this.depthScale.range([0,80])(node.depth)}%)` : 'black',
                strokeWidth: '2px',
            };
        };

        function mouseoverTextStyle(node) {
            return {
                textAnchor: 'middle',
                fontSize: '1em',
                fill: 'black',
                x: node.x,
                y: node.y,
                dy: '0.35em',
                display: 'none',
                transform: 'translate(0,-8px)',
            }
        };

        this.nodes = nodeData.map((node) => {
            return <g id={node.data.id}
                      key={node.data.id}
                      style={initialNodeStyle(node)}
                      onClick={e => this.handleNodeClick(e,node)}
                      onMouseOver={e => this.handleMouseOver(e,node)}
                      onMouseOut={e => this.handleMouseOut(e,node)}
                      className={(node.parent) ? (node.children ? 'node node--internal' : 'node node--leaf') : 'node node--internal node--this.root'}>
                <circle
                    style={initialNodeCircleStyle(node)}
                    className={'node-circle'}/>
                <text
                    style={mouseoverTextStyle(node)}
                    className='node-text'>{this.props.cleanName(node.data.id)}</text>
                {this.generateTrunk(node)}
            </g>
        });

    };

    render() {
        this.createTree(this.props.data);
        const treeHolderStyle = {
            transition:'width 1s',
            flex:1,
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            minWidth:`${this.props.size[0]}px`,
            height:`${this.props.size[1]}px`
        };
        const svgStyle = {
            width: '100%',
            height:'90%'
        };
        const gStyle = {
            transform:`translate(${this.margin.left}px, ${this.height + this.margin.top}px)`
        };

        return <div style={treeHolderStyle}>
            <svg style={svgStyle}>
                 <g style={gStyle}>
                    {this.state.opacity > 0 ? this.generateLinks(this.state.opacity) : this.links}
                    {this.nodes}</g>
            </svg>
            <Grass size={this.props.size}/>
        </div>
    }
}

export default Tree;