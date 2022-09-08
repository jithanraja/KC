import React, { Component } from 'react'
import { FormModel } from '../../../shared';
import ListCommunity from './ListCommunity';
import './style.scss'

export class Community extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedCommunity: '',
            reloadCommunity: false
        }
    }

    changeHardReload = () => {
        this.setState({ reloadCommunity: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedCommunity: id,
            showEdit: true
        })
    }

    render() {
        const { showAdd, showEdit, reloadCommunity } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Community</span>
                    </div>
                    <ListCommunity 
                        hardReload={reloadCommunity} 
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                        />

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create Community'}
                    >
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit Community'}
                    >
                    </FormModel>


                </div> 
            </div>
        )
    }
}

export default Community