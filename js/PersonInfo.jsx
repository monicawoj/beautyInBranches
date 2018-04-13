import React from "react";

class PersonInfo extends React.Component {

    handleDeleteButtonClick = () => {
        this.props.resetForm();
        this.props.deleteNode(this.props.focusNode);
    };

    render() {
        const {first, last, mother, father, birthDate, birthLocation, email, info, spouse} = this.props.focusNode.data.data;

        const buttonStyle = {
            color: 'white',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            borderRadius: '5px',
            boxSizing: 'border-box',
            justifyContent: 'center',
            flex: 1,
            //width: '50%',
            cursor: 'pointer',
        };

        const divStyle = {
            color: 'black',
            marginBottom: '10px',
        };

        const spanStyle = {
            color: 'royalblue',
        };

        return <div style={{
            position:'relative',
            transition:'width 1s',
            overflow: 'scroll',
            background: 'white',
            width:this.props.size[0],
            flex:'auto',
            display:'flex',
            marginBottom: '20%',
            justifyContent:'flex-start',
            flexDirection:'column'}}>
            <div style={{width:'inherit', marginBottom:'50px'}}>
                <h3 style={divStyle}>
                    <span style={spanStyle}>{first} {last}</span>
                </h3>
                {birthDate ? <div style={divStyle}>
                    Born: <span style={spanStyle}>{birthDate}</span>
                </div> : null}
                {birthLocation ? <div style={divStyle}>
                    Hometown: <span style={spanStyle}>{birthLocation}</span>
                </div> : null}
                {mother ? <div style={divStyle}>
                    Mother: <span style={spanStyle}>{mother}</span>
                </div> : null}
                {father ? <div style={divStyle}>
                    Father: <span style={spanStyle}>{father}</span>
                </div> : null}
                {mother && !father ? <div style={divStyle}>
                    Parent: <span style={spanStyle}>{mother}</span>
                </div> : null}
                {spouse ? <div style={divStyle}>
                    Spouse: <span style={spanStyle}>{spouse}</span>
                </div> : null}
                {email ? <div style={divStyle}>
                    Contact Info:
                    <div style={divStyle}>
                        <span style={spanStyle}>Email: {email}</span>
                    </div>
                </div> : null}
                {info ? <div style={divStyle}>
                    Dodatkowe info:
                    <ul>
                        <li>{info}</li>
                    </ul>
                </div> : null}
            </div>
            <div style={{
                position: 'absolute',
                width: 'inherit',
                bottom: 0,
                left: 0,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px',
            }}>
                <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                    <div
                        className='button edit'
                        onClick={this.props.handleEditClick}
                        style={{...buttonStyle, background: 'grey'}}>
                        {this.props.menuExpanded ? <p>edit</p> : null}
                    </div>
                    <div
                        className='button delete'
                        onClick={e => this.handleDeleteButtonClick()}
                        style={{...buttonStyle, background: 'LightCoral'}}>
                        {this.props.menuExpanded ? <p>delete</p> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PersonInfo;