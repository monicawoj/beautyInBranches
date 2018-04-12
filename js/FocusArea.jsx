import React from 'react';
import ReactDOM from 'react-dom';

class FocusAreaHeader extends React.Component {
    render() {
        const headerStyle = {
            background: 'grey',
            color: 'white',
            borderRight: '2px solid blue',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            height: '10%',
            width: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center',
        };

        return <div style={headerStyle}>
            <p>{this.props.focus.header}</p>
        </div>
    }
}

class FocusArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              firstName:'Monica',
              surname: 'Wojciechowski',
              birthDate: '1994-03-30',
              birthLocation: 'Belleville, NJ',
              currentLocation: 'Warszawa, Polska',
              birthParent: 'Elzbieta Wojciechowska-Leszek Wojciechowski',
              email: 'monica@gmail.pl',
              info: 'Coś ciekawego o Monice',
              header: 'add family member',
              spouse: '',
        };
    }

    // handleFirstNameChange = (event) => {
    //     this.setState({
    //         person.firstName : event.target.value,
    //     });
    // };
    //
    // handleSurnameChange = (event) => {
    //     this.setState({
    //         person.surname : event.target.value,
    //     });
    // };
    //
    // handleBirthDateChange = (event) => {
    //     this.setState({
    //         person.birthDate : event.target.value,
    //     });
    // };
    //
    // handleBirthLocationChange = (event) => {
    //     this.setState({
    //         person.birthLocation : event.target.value,
    //     });
    // };
    //
    // handleBirthParentChange = (event) => {
    //     this.setState({
    //         person.birthParent : event.target.value,
    // });
    // };
    //
    // handleEmailChange = (event) => {
    //     this.setState({
    //         person.email : event.target.value,
    //     });
    // };
    //
    // handleInfoChange = (event) => {
    //     this.setState({
    //         person.info : event.target.value,
    //     });
    // };
    //
    // handleSpouseChange = (event) => {
    //     this.setState({
    //        person.spouse : event.target.value,
    //     });
    // };

    // handleSubmit = (event) => {
    //     event.preventDefault();
    //     //expecting a person!
    //     return 'hello';
    //
    //    /* if (this.checkName()+this.checkEmail()+this.checkMessage() === 3) {
    //         this.setState({
    //             successText: `Dziękujemy za wiadomość. Wysłano do wydziału: ${this.state.selectedDepartment}`,
    //             nameErrorText: '',
    //             emailErrorText: '',
    //             messageErrorText: '',
    //         });
    //     }*/
    // };

    render(){
        const {header, name, birthDate, birthLocation, birthParent, email, info} = this.state.person;
        //const person = 'hello';

        return <div style={{background: 'white', height:this.props.size[1], width:this.props.size[0], display:'flex', justifyContent:'center', flexDirection:'column'}}>
            <FocusAreaHeader focus={this.props.focus}/>
            <form style={{boxSizing:'border-box', borderRight:'2px solid blue', width:'100%', height:'90%', display:'flex',flexDirection:'column', minHeight: '200px', justifyContent:'flex-start', alignContent:'center'}}>
                <label>Imię i nazwisko
                    <input
                        //onChange={this.handleNameChange}
                        value={name}
                        type='text'
                        placeholder='Imię i nazwisko'>
                    </input>
                </label>
                <label>Data urodzenia
                    <input
                        //onChange={this.handleNameChange}
                        value={birthDate}
                        type='date'
                        placeholder='Data urodzenia'>
                    </input>
                </label>
                <label>Miasto urodzenia
                    <input
                        //onChange={this.handleEmailChange}
                        value={birthLocation}
                        type='text'
                        placeholder='Miasto urodzenia'/>
                </label>
                <label>Rodzice
                    <select
                        value={birthParent}
                        //onChange={this.handleSelectChange}>
                        >Rodzice
                        <option value='Elzbieta Wojciechowska-Leszek Wojciechowski'>Elzbieta Wojciechowska-Leszek Wojciechowski</option>
                        <option value='Parent1-Parent2'>Parent1-Parent2</option>
                        <option value='options'>make options based on data nodes cleanName</option>
                    </select>
                </label>
                <label>Email
                    <input
                        //onChange={this.handleEmailChange}
                        value={email}
                        type='email'
                        placeholder='Email'/>
                </label>
                <label>Dodatkowe informacje
                    <textarea
                        //onChange={this.handleMessageChange}
                        value={info}
                        placeholder='Dodatkowe informacje'/>
                </label>
                <input
                    type='submit'
                    onClick={this.props.triggerParentUpdate(this.handleSubmit)}/>
            </form>
        </div>
    }
}

export default FocusArea;