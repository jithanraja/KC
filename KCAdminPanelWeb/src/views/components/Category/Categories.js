import { Add } from '@material-ui/icons'
import React, { Component } from 'react'
import { FormModel } from '../../../shared';
import CreateCategory from './CreateCategory';
import EditCategory from './EditCategory';
import ListCategories from './ListCategories'
import './style.scss'

export class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedCategory: '',
            reloadCategory: false
        }
    }

    changeHardReload = () => {
        this.setState({ reloadCategory: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedCategory: id,
            showEdit: true
        })
    }

    render() {
        const { showAdd, showEdit, reloadCategory, selectedCategory } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Categories</span>
                    </div>
                    <ListCategories 
                        hardReload={reloadCategory} 
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                        />
                    <button className="add-button" onClick={() => this.setState({ showAdd: true })}><Add /></button>

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create Category'}
                    >
                        <CreateCategory onHide={() => this.setState({ showAdd: false, reloadCategory: true })} />
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit Category'}
                    >
                        <EditCategory catId={selectedCategory} onHide={() => this.setState({ showEdit: false, reloadCategory: true })} />
                    </FormModel>


                </div> 
            </div>
        )
    }
}

export default Categories