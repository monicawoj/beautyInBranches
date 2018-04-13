import React from 'react';
import PersonInfo from './PersonInfo.jsx';
import AddPersonMenu from './AddPersonMenu.jsx';
import ExpandAndCollapse from './ExpandAndCollapse.jsx';
import ReactDOM from 'react-dom';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {
                first: '',
                last: '',
                birthDate: '',
                birthLocation: '',
                email: '',
                info: '',
                spouse: '',
                sex: 'Male',
                mother: '',
                father: '',
                parent: '',
            },
        };
    }

    handleFirstNameChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                first : event.target.value,
            },
        });
    };

    handleLastNameChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                last : event.target.value,
            },
        });
    };

    handleBirthDateChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                birthDate : event.target.value,
            },
        });
    };

    handleBirthLocationChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                birthLocation : event.target.value,
            },
        });
    };

    handleParentChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                mother : this.props.cleanName(event.target.value).split('-')[0],
                father : this.props.cleanName(event.target.value).split('-')[1],
                parent : this.props.cleanName(event.target.value),
            },
        });
    };

    handleEmailChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                email : event.target.value,
            },
        });
    };

    handleInfoChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                info : event.target.value,
            },
        });
    };

    handleSpouseChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                spouse : event.target.value,
            },
        });
    };

    handleSexInputChange = (event) => {
        this.setState({
            person : {
                ...this.state.person,
                sex : event.target.value,
            },
        });
    };

    handleEditClick = () => {
        this.setState({
           person: this.props.focusNode.data.data,
        });

        this.props.returnToEdit();
    };

    resetForm = () => {
        this.setState({
            person: {
                first: '',
                last: '',
                birthDate: '',
                birthLocation: '',
                email: '',
                info: '',
                spouse: '',
                sex: 'Male',
                error: '',
                mother: '',
                father: '',
                parent: '',
            },
        });
    };

    render(){
        const {menuExpanded} = this.props;
        const size = (menuExpanded) ? this.props.size : [0,this.props.size[1]];

        return <div
                style={{
                    height: this.props.size[1],
                    display:'flex',
                    flexDirection: 'row'}}>
            {this.props.action === 'manual-add' || this.props.action === 'save' ? <AddPersonMenu cleanName={this.props.cleanName} action={this.props.action} errorLastName={this.props.errorLastName} errorFirstName={this.props.errorFirstName} person={this.state.person} handleInfoChange={this.handleInfoChange} handleFirstNameChange={this.handleFirstNameChange} handleLastNameChange={this.handleLastNameChange} handleEmailChange={this.handleEmailChange} handleSexInputChange={this.handleSexInputChange} handleSpouseChange={this.handleSpouseChange} handleBirthDateChange={this.handleBirthDateChange} handleBirthLocationChange={this.handleBirthLocationChange} handleParentChange={this.handleParentChange} menuExpanded={this.props.menuExpanded} triggerParentUpdate={this.props.triggerParentUpdate} data={this.props.data} size={size}/> : null}
            {this.props.action === 'edit' ? <PersonInfo resetForm={this.resetForm} deleteNode={this.props.deleteNode} menuExpanded={this.props.menuExpanded} handleEditClick={this.handleEditClick} changeFocusPerson={this.changeFocusPerson} person={this.state.person} focusNode={this.props.focusNode} triggerParentUpdate={this.props.triggerParentUpdate} data={this.props.data} size={size}/> : null}
            <ExpandAndCollapse toggleExpand={this.props.toggleExpand} menuExpanded={this.props.menuExpanded} size={['5px','100%']}/>
        </div>
    }
}

export default SideBar;