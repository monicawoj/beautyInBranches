import React from 'react';
import ReactDOM from 'react-dom';
import people from './treedata.jsx';
import Tree from './Tree.jsx';
import SideBar from './SideBar.jsx';
import {stratify} from "d3-hierarchy";
import { csvParse } from "d3-dsv";
import MainHeader from './MainHeader.jsx';

class LoadDataSection extends React.Component {
    render() {

        const tableSectionStyle = {
            height: '100vh',
            width:'100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        };

        const buttonStyle = {
            color: 'white',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            borderRadius: '5px',
            boxSizing: 'border-box',
            justifyContent: 'center',
            flex: 1,
            width: '50%',
            cursor: 'pointer',
        };

        return <div id='LoadDataSection' style={tableSectionStyle}>
            <h1 style={{fontSize:'26px'}}>Upload CSV data</h1>
            <h2 style={{fontSize:'18px', margin:0}}>
                Please ensure that your file includes the following columns (named exactly as shown), and <b> one root node</b> (node with no mother or father specified):
            </h2>
            <table>
                <thead>
                <tr>
                    <th>first</th>
                    <th>last</th>
                    <th>mother</th>
                    <th>father</th>
                    <th>sex</th>
                    <th>spouse</th>
                    <th>birthDate</th>
                    <th>birthLocation</th>
                    <th>email</th>
                    <th>info</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Krzysztof</td>
                    <td>Cebula</td>
                    <td></td>
                    <td></td>
                    <td>Male</td>
                    <td>Ksenia Gronek</td>
                    <td>05/21/57</td>
                    <td>Warszawa, Polska</td>
                    <td>krzyszek@gmail.pl</td>
                    <td>Profesionalny piłkarz</td>
                </tr>
                <tr>
                    <td>Ala</td>
                    <td>Cebula</td>
                    <td>Maria Gierek</td>
                    <td>Krzysztof Cebula</td>
                    <td>Female</td>
                    <td>Feliks Wozniak</td>
                    <td>12/05/89</td>
                    <td>Rzeszów, Polska</td>
                    <td>ale@gmail.pl</td>
                    <td>Mieszka w Tajlandii</td>
                </tr>
                </tbody>
            </table>
            <p>
                <span style={{color:'LightCoral'}}>Are you sure?</span> This will remove all of your existing data and replace with new data located in your CSV file.
            </p>
            <div style={{width:'80%', display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                <div style={{...buttonStyle, background: 'white', color:'black', flex:2}}>
                    <input onChange={this.props.handleFileUploadChange}
                       type='file'
                       id='file'
                       accept='.csv'
                       name='file'/>
                </div>
                <a
                    href='#MainHeader'
                    onClick={e => this.props.convertCsvToJson(this.props.csvContents)}
                    style={{...buttonStyle, background: (this.props.pathToCsv) ? '#00cc66' : 'grey', marginBottom:'5px', textDecoration:'none'}}>
                    <p>submit</p>
                </a>
            </div>
        </div>
    }
}

class DownloadUploadCSV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadHover: false,
            uploadHover: false,
        }
    }

    buttonStyle = (hoverType) => {
        return {
            width: (hoverType) ? '100px' : '50px',
            height: '50px',
            backgroundColor: 'white',
            borderRadius: (hoverType) ? '5px' : '50%',
            boxShadow: (hoverType) ? '0 6px 10px 0 #666' : '0 6px 14px 0 #666',
            transition: 'all 0.1s ease-in-out',

            fontSize: '0.6em',
            color: 'royalblue',
            textAlign: 'center',
            textDecoration: 'none',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            transform: (hoverType) ? 'scale(1.05)' : '',
            marginBottom: '20px',
        }
    };

    render() {
        const {uploadHover, downloadHover} = this.state;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const result = this.props.downloadCSV({
            filename: `myTreeData_${year}${month}${day}.csv`,
            data: this.props.data,
        });
        const downloadButtonStyle = this.buttonStyle(downloadHover);
        const uploadButtonStyle = this.buttonStyle(uploadHover);

        return <div style={{
            position: 'absolute',
            top: '15%',
            right: '30px',
        }}>
            <a style={downloadButtonStyle}
               onMouseOver={e => this.setState({downloadHover : true})}
               onMouseOut={e => this.setState({downloadHover : false})}
               href={result.path}
               download={result.filename}>
                <p style={{
                    fontSize: downloadHover ? '12px' : '0',
                    color: downloadHover ? 'royalblue' : 'white',
                }}>
                    Download tree data as CSV
                </p>
                <i className="material-icons">
                    file_download
                </i>
            </a>
            <a style={uploadButtonStyle}
               onMouseOver={e => this.setState({uploadHover : true})}
               onMouseOut={e => this.setState({uploadHover : false})}
               href='#LoadDataSection'
               download={result.filename}>
                <p style={{
                    fontSize: uploadHover ? '12px' : '0',
                    color: uploadHover ? 'royalblue' : 'white',
                }}>
                    Upload new data
                </p>
                <i className="material-icons">
                    playlist_add
                </i>
            </a>
        </div>;
    }
}

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
        });
    };

    addNewPerson = (e,person) => {
        e.preventDefault();

        if (person.first && person.last && person.sex && person.parent) {
            const currentData = this.state.rawdata;
            const newData = [...currentData];
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
            });
        } else if (!person.last) {
            this.setState({
                errorLastName: true,
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
        const dataAfterNodeDelete = this.state.rawdata.filter(person => person.fullName !== node.data.data.fullName);
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
        })
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

    render() {
        const {rawdata, svgFullWidth} = this.state;
        const width = this.state.screenWidth;
        const height = this.state.screenHeight;
        const svgWidthFactor = svgFullWidth ? 1 : 0.7;

        const data = stratify()
            .id(function(d) {
                if (d.sex === 'Female') {
                    return `${d.first} ${d.last}-${d.spouse}`
                } else {
                    return `${d.spouse}-${d.first} ${d.last}`
                }
            })
            .parentId(function(d) {
                if (d.mother || d.father) {
                    return `${d.mother}-${d.father}`
                } else {
                    return '';
                }
            })
            (rawdata);

        data.each(function(d) {
            d.fullName = `${d.data.first} ${d.data.last}`;
            d.surname = (d.data.sex === 'Female' && d.data.spouse) ? `${d.data.spouse.split(' ')[1]}` : `${d.data.last}`;
        });

        data.each(function(d) {
            d.child = (d.data.sex === 'Female') ? `${d.data.first} ${d.data.last}-${d.data.spouse}` : `${d.data.spouse}-${d.data.first} ${d.data.last}`;
            d.parent = (d.data.mother || d.data.father) ? `${d.data.mother}-${d.data.father}` : '';
        });

        const appStyles = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        };

        return <div style={appStyles}>
                <MainHeader
                    data={data}
                    size={[width, height*0.1]}/>
                <div
                    style={{
                        position:'relative',
                        background:'white',
                        overflow:'hidden',
                        width:`${width}px`,
                        height:`${height*0.9}px`,
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'flex-start',
                        alignItems:'flex-start'}}>
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
                <DownloadUploadCSV data={this.state.rawdata} downloadCSV={this.downloadCSV}/>
                <LoadDataSection convertCsvToJson={this.convertCsvToJson} handleFileUploadChange={this.handleFileUploadChange} pathToCsv={this.state.pathToCsv} csvContents={this.state.csvContents}/>
        </div>
    }
}

export default App