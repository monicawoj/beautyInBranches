import React from "react";

class AddPersonMenu extends React.Component {
    render() {
        const {first, last, mother, father, birthDate, birthLocation, email, info, spouse, sex, parent} = this.props.person;

        const {data} = this.props;

        const person = {
            first,
            last,
            mother,
            father,
            birthDate,
            birthLocation,
            email,
            info,
            sex,
            spouse,
            parent,
        };
        person.fullName = `${first} ${last}`;
        person.child =  (sex === 'Female') ? this.props.cleanName(`${first} ${last}-${spouse ? spouse : ''}`) : this.props.cleanName(`${spouse ? spouse : ''}-${first} ${last}`);
        person.surname = (sex === 'Female' && spouse) ? spouse.split(' ')[1] : last;
        person.parent = (mother || father) ? this.props.cleanName(`${mother ? mother : ''}-${father ? father : ''}`) : '';

        let parents = [];
        data.each(person => {
            parents.push(person.child);
        });

        const parentOptions = parents.map(name => {
            return <option key={name} value={name}>{name}</option>
        });

        const addButtonStyle = {
            background: 'grey',
            color: 'white',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            borderRadius: '5px',
            boxSizing: 'border-box',
            justifyContent: 'center',
            width: '80%',
            cursor: 'pointer',
        };

        const labelStyle = {
            fontSize: '12px',
            fontFamily: '"Lato", sans-serif',
        };

        if (person.first && person.last && person.sex && person.parent) {
            addButtonStyle.background = '#00cc66';
        }

        let buttonText;
        if (this.props.menuExpanded) {
            if (this.props.action === 'manual-add') {
                buttonText = <p>add {person.first} to tree</p>
            } else {
                buttonText = <p>save changes</p>
            }
        } else {
            buttonText = null;
        }


        return <div style={{
            transition:'width 1s',
            overflow: 'scroll',
            background: 'white',
            height:this.props.size[1],
            width:this.props.size[0],
            flex:'auto',
            display:'flex',
            marginBottom: '10%',
            justifyContent:'flex-start',
            flexDirection:'column'}}>
            <form style={{width:'inherit', marginBottom:'50px'}}>
                <label
                    style={labelStyle}>
                    Imię
                    <input
                        style={{
                            border: this.props.errorFirstName ? '2px solid LightCoral' : '1px solid grey',
                            borderRadius: '4px'}}
                        onChange={e => this.props.handleFirstNameChange(e)}
                        value={first}
                        type='text'
                        placeholder='Imię'>
                    </input>
                </label>
                <label
                    style={labelStyle}>
                    Nazwisko (rodowe)
                    <input
                        style={{
                            border: this.props.errorLastName ? '2px solid LightCoral' : '1px solid grey',
                            borderRadius: '4px'}}
                        onChange={e => this.props.handleLastNameChange(e)}
                        value={last}
                        type='text'
                        placeholder='Nazwisko (rodowe)'>
                    </input>
                </label>
                <label
                    style={labelStyle}>
                    Data urodzenia
                    <input
                        onChange={e => this.props.handleBirthDateChange(e)}
                        value={birthDate}
                        type='date'
                        placeholder='Data urodzenia'>
                    </input>
                </label>
                <label
                    style={labelStyle}>
                    Miasto urodzenia
                    <input
                        onChange={e => this.props.handleBirthLocationChange(e)}
                        value={birthLocation}
                        type='text'
                        placeholder='Miasto urodzenia'/>
                </label>
                <label
                    style={labelStyle}>
                    Rodzic(e)
                    <select
                        value={this.props.cleanName(`${mother}-${father}`)}
                        onChange={e => this.props.handleParentChange(e)}>
                        {parentOptions}
                    </select>
                </label>
                <label
                    style={labelStyle}>
                    Żona/Mąż: Imię i Nazwisko
                    <input
                        onChange={e => this.props.handleSpouseChange(e)}
                        value={spouse}
                        type='text'
                        placeholder='Spouse name and surname'/>
                </label>
                <label
                    style={labelStyle}>
                    Płeć
                    <select
                        value={sex}
                        onChange={e => this.props.handleSexInputChange(e)}>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                </label>
                <label
                    style={labelStyle}>
                    Email
                    <input
                        onChange={e => this.props.handleEmailChange(e)}
                        value={email}
                        type='email'
                        placeholder='Email'/>
                </label>
                <label
                    style={labelStyle}>
                    Dodatkowe informacje
                    <textarea
                        onChange={e => this.props.handleInfoChange(e)}
                        value={info}
                        placeholder='Dodatkowe informacje'/>
                </label>
            </form>
            <div style={{
                position: 'absolute',
                width: 'inherit',
                bottom: 0,
                left: 0,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50px',
            }}>
                <div
                    className='button addToTree'
                    onClick={e => this.props.triggerParentUpdate(e,person)}
                    style={addButtonStyle}>
                    {buttonText}
                </div>
            </div>
        </div>
    }
}

export default AddPersonMenu;