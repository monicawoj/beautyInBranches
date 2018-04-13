import React from "react";

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
        const downloadTextStyle = {
            fontSize: downloadHover ? '12px' : '0',
            color: downloadHover ? 'royalblue' : 'white',
        };
        const uploadTextStyle = {
            fontSize: uploadHover ? '12px' : '0',
            color: uploadHover ? 'royalblue' : 'white',
        };

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
                <p style={downloadTextStyle}>
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
                <p style={uploadTextStyle}>
                    Upload new data
                </p>
                <i className="material-icons">
                    playlist_add
                </i>
            </a>
        </div>;
    }
}

export default DownloadUploadCSV;