import { Add } from '@material-ui/icons'
import React, { Component } from 'react'
import { FormModel } from '../../../shared';
import CreateStore from './CreateStore';
import EditStore from './EditStore';
import ListStores from './ListStores'
import './style.scss'

export class Stores extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedStore: '',
            reloadStores: false
        }
    }

    changeHardReload = () => {
        this.setState({ reloadStores: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedStore: id,
            showEdit: true
        })
    }

    render() {
        const { showAdd, showEdit, reloadStores, selectedStore } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Stores</span>
                    </div>
                    <ListStores 
                        hardReload={reloadStores} 
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                        />
                    <button className="add-button" onClick={() => this.setState({ showAdd: true })}><Add /></button>

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create Store'}
                    >
                        <CreateStore onHide={() => this.setState({ showAdd: false, reloadStores: true })} />
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit Store'}
                    >
                        <EditStore storeId={selectedStore} onHide={() => this.setState({ showEdit: false, reloadStores: true })} />
                    </FormModel>


                </div> 
            </div>
        )
    }
}

export default Stores