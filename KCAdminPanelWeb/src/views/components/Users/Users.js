import { Add } from '@material-ui/icons'
import React, { Component } from 'react'
import { FormModel } from '../../../shared';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import ListUsers from './ListUsers'
import './style.scss'

export class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedUser: '',
            reloadUsers: false
        }
    }

    changeHardReload = () => {
        this.setState({ reloadUsers: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedUser: id,
            showEdit: true
        })
    }

    render() {
        const { showAdd, showEdit, reloadUsers, selectedUser } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Users</span>
                    </div>
                    <ListUsers 
                        hardReload={reloadUsers} 
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                        />
                    <button className="add-button" onClick={() => this.setState({ showAdd: true })}><Add /></button>

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create User'}
                    >
                        <CreateUser onHide={() => this.setState({ showAdd: false, reloadUsers: true })} />
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit User'}
                    >
                        <EditUser userId={selectedUser} onHide={() => this.setState({ showEdit: false, reloadUsers: true })} />
                    </FormModel>


                </div> 
            </div>
        )
    }
}

export default Users