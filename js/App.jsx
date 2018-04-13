import React from 'react';
import ReactDOM from 'react-dom';
import people from './treedata.jsx';
import Tree from './Tree.jsx';
import SideBar from './SideBar.jsx';
import {stratify} from "d3-hierarchy";
import { csvParse } from "d3-dsv";
import MainHeader from './MainHeader.jsx';
import LoadDataSection from './LoadDataSection.jsx';
import DownloadUploadCSV from './DownloadUploadCSV.jsx';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            rawdata: people,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            surname: '',
            menuExpanded: false,
            svgFullWidth: true,
            errorFirstName: false,
            errorLastName: false,
            pathToCsv: '',
            csvContents: '',
        };
    }

    convertCsvToJson = (csvContents) => {
        const jsonData = csvParse(csvContents);
        this.setState({
            rawdata: [...jsonData],
            menuExpanded: false,
            svgFullWidth: true,
        });
        this.returnToAdd();
    };

    addNewPerson = (e,person) => {
        e.preventDefault();

        if (person.first && person.last && person.sex && person.parent) {
            const currentData = this.state.rawdata;
            console.log(currentData);
            const newData = [...currentData];
            console.log(newData);
            newData.push(person);
            this.setState({
                rawdata: newData,
                errorFirstName : false,
                errorLastName : false,
            });
        } else if (!person.first && !person.last) {
            this.setState({
                errorFirstName: true,
                errorLastName: true,
            });
        } else if (!person.first) {
            this.setState({
                errorFirstName: true,
                errorLastName: false,
            });
        } else if (!person.last) {
            this.setState({
                errorLastName: true,
                errorFirstName: false,
            });
        }

        if (this.state.action === 'save') {
            this.deleteNode(this.state.focusNode);
        }
    };

    cleanName = (name) => {
        if (name.indexOf("-")===0) {
            name = name.substring(1);
        }
        if (name.indexOf("-")===(name.length-1)) {
            name = name.substring(0,name.length-1);
        }
        return name;
    };

    onResize = () => {
        this.setState({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        });
    };

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);
        this.onResize();
    }

    toggleExpand = () => {
        this.setState({
            menuExpanded: !this.state.menuExpanded,
            svgFullWidth: !this.state.svgFullWidth,
            action: 'manual-add',
        });

    };

    deleteNode = (node) => {
        const dataAfterNodeDelete = this.state.rawdata.filter(person => `${person.first} ${person.last}` !== `${node.data.data.first} ${node.data.data.last}`);
        this.setState({
            rawdata: dataAfterNodeDelete,
        });

        this.returnToAdd();
    };

    returnToAdd = () => {
        this.setState({
           action: 'manual-add',
        });
    };

    returnToEdit = () => {
        this.setState({
            action: 'save',
        });
    };

    handleNodeClickInApp = (node) => {
        this.setState({
            focusNode: node,
            menuExpanded: true,
            svgFullWidth: false,
            action: 'edit',
        });
    };

    handleFileUploadChange = (event) => {
        let file = event.target.files[0];
        this.setState({
            pathToCsv: file,
        });
        const reader = new FileReader();
        reader.addEventListener("load", e => this.readFile(e));
        reader.readAsText(file);
    };

    readFile = (event) => {
        const csvContents = event.target.result;
        this.setState({
            csvContents,
        })
    };

    downloadCSV = (args) => {
        let csv = this.convertJSONtoCSV({
            data: args.data
        });
        if (csv == null) return;

        const filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        const path = encodeURI(csv);

        return {
            path: path,
            filename: filename,
        };
    };

    convertJSONtoCSV = (args) => {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    };

    smoothScroll = (e,target) => {
        e.preventDefault();
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    };

    render() {
        const {rawdata, svgFullWidth} = this.state;
        const width = this.state.screenWidth;
        const height = this.state.screenHeight;
        const svgWidthFactor = svgFullWidth ? 1 : 0.7;

        const data = stratify()
            .id((d) => {
                if (d.sex === 'Female') {
                    return this.cleanName(`${d.first} ${d.last}-${d.spouse}`)
                } else {
                    return this.cleanName(`${d.spouse}-${d.first} ${d.last}`)
                }
            })
            .parentId((d) => {
                if (d.parent) {
                    return d.parent
                }
                else if (d.mother || d.father) {
                    return this.cleanName(`${d.mother}-${d.father}`)
                } else {
                    return '';
                }
            })
            (rawdata);

        data.each((d) => {
            d.fullName = `${d.data.first} ${d.data.last}`;
            d.surname = (d.data.sex === 'Female' && d.data.spouse) ? `${d.data.spouse.split(' ')[1]}` : `${d.data.last}`;
            d.child = (d.data.sex === 'Female') ? this.cleanName(`${d.data.first} ${d.data.last}-${d.data.spouse ? d.data.spouse : ''}`) : this.cleanName(`${d.data.spouse ? d.data.spouse : ''}-${d.data.first} ${d.data.last}`);
            d.parent = (d.data.mother || d.data.father) ? this.cleanName(`${d.data.mother ? d.data.mother : ''}-${d.data.father ? d.data.father : ''}`) : '';
        });

        const appStyle = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        };
        const mainSectionStyle = {
            position:'relative',
            background:'white',
            overflow:'hidden',
            width:`${width}px`,
            height:`${height*0.9}px`,
            display:'flex',
            flexDirection:'row',
            justifyContent:'flex-start',
            alignItems:'flex-start'
        };

        return <div style={appStyle}>
                <MainHeader
                    data={data}
                    size={[width, height*0.1]}/>
                <div style={mainSectionStyle}>
                    <SideBar
                        errorFirstName={this.state.errorFirstName}
                        errorLastName={this.state.errorLastName}
                        deleteNode={this.deleteNode}
                        returnToEdit={this.returnToEdit}
                        action={this.state.action}
                        focusNode={this.state.focusNode}
                        menuExpanded={this.state.menuExpanded}
                        toggleExpand={this.toggleExpand}
                        cleanName={this.cleanName}
                        triggerParentUpdate={this.addNewPerson}
                        data={data}
                        size={[width*0.3, height*0.9]}/>
                    <Tree
                        downloadCSV={this.downloadCSV}
                        convertJSONtoCSV={this.convertJSONtoCSV}
                        handleNodeClickInApp={this.handleNodeClickInApp}
                        cleanName={this.cleanName}
                        data={data}
                        size={[width*svgWidthFactor, height*0.9]}/>
                </div>
                <DownloadUploadCSV
                    smoothScroll={this.smoothScroll}
                    data={this.state.rawdata}
                    downloadCSV={this.downloadCSV}/>
                <LoadDataSection
                    smoothScroll={this.smoothScroll}
                    convertCsvToJson={this.convertCsvToJson}
                    handleFileUploadChange={this.handleFileUploadChange}
                    pathToCsv={this.state.pathToCsv}
                    csvContents={this.state.csvContents}/>
        </div>
    }
}

export default App