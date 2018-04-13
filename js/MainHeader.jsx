import React from "react";

class MainHeader extends React.Component {
    render() {
        const {size,data} = this.props;
        const headerStyle = {
            color: 'white',
            background: 'black',
            width: size[0],
            height: size[1],
            display: 'flex',
            flexDirection: (window.innerWidth<500) ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
        };

        const h1size = headerStyle.height*0.6;
        const h2size = headerStyle.height*0.4;

        const spanStyle = {
            //textTransform: 'uppercase',
            //fontWeight: 800,
            fontSize: h1size*0.5,
        };

        return <div id='MainHeader' style={headerStyle}>
            <div style={{padding: h1size*0.5}}>
                <h1 style={{textAlign: 'center', fontSize:h1size}}>
                    bloom. <span style={spanStyle}>interactive family tree creator</span>
                </h1>
            </div>
            <div style={{padding: h2size*0.5}}>
                <h2 style={{fontSize:h2size, position:'absolute', color:'royalblue', top:size[1]/1.5, right:'1%',zIndex:999}}>{data.surname} Family Tree</h2>
            </div>
        </div>
    }
}

export default MainHeader;