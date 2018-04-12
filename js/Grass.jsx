import React from "react";

class Grass extends React.Component {
    render() {
        const grassBladeWidth = 10;
        const totalBlades = this.props.size[0]/grassBladeWidth;
        const grassColor = 'DarkSeaGreen';
        const grassStyle = {
            width: '100%',
            height:'20%',
            background:grassColor,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 0,
            padding: 0,
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

        return <div style={{width:`100%`, height:`${this.props.size[1]*0.1}px`}}>
            <div style={grassStyle}>
                {grassTriangles}
            </div>
            <div style={{width:`${grassStyle.width}px`, height:`90%`, background:`BurlyWood`}}/>
        </div>;
    }
}

export default Grass;