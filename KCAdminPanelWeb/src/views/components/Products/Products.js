import { Add } from '@material-ui/icons'
import React, { Component, createRef } from 'react'
import { FormModel, SearchBar } from '../../../shared';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import ListProducts from './ListProducts'
import FilterProduct from './FilterProduct';
import filterIcon from './../../../assets/images/filter.svg'
import { Menu } from '@material-ui/core'
import './style.scss'

export class Products extends Component {

    constructor(props) {
        super(props);
        this.childRef = createRef();
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedProduct: '',
            reloadProducts: false,
            anchorEl: null,
            open: false,
            searchTerm: '',
            filters: '',
            selectFilterValue: { categoryId: '', status: '' }
        }
    }

    changeHardReload = () => {
        this.setState({ reloadProducts: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedProduct: id,
            showEdit: true
        })
    }
    handleSearch = (e) => {
        this.setState({ searchTerm: e })
        this.childRef.current.onFilterChange(e, this.state.filters);
    }
    handleFilter = (e) => {
        this.setState({ selectFilterValue: { categoryId: '', status: '' } })
        e.forEach(element => {
            this.state.selectFilterValue[element.key] = element.value
        })
        let filtervalue = (e.length > 0) ? JSON.stringify(e) : '';
        this.setState({ filters: filtervalue, selectFilterValue: this.state.selectFilterValue })
        this.childRef.current.onFilterChange(this.state.searchTerm, filtervalue);
    }
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget, open: Boolean(event.currentTarget) });
    };

    handleClose = () => {
        this.setState({ anchorEl: null, open: false });
    };

    render() {

        const { showAdd, showEdit, reloadProducts, selectedProduct, anchorEl, open } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Products</span>
                        <div className="float-right row">
                            <SearchBar handleSearch={this.handleSearch} />
                            <div className="ml-3 mr-2 pt-1">
                                {/* <FilterList/> */}
                                <img src={filterIcon} width={30} height={23} onClick={e => this.handleClick(e)} alt="profile" />
                                <Menu
                                    id={1}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={this.handleClose}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}>
                                    <FilterProduct selectValue={this.state.selectFilterValue} handleFilter={this.handleFilter} onCancel={() => this.setState({ anchorEl: null, open: false })} onHide={() => this.setState({ anchorEl: null, open: false })} />
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <ListProducts
                        ref={this.childRef}
                        hardReload={reloadProducts}
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                    />
                    <button className="add-button" onClick={() => this.setState({ showAdd: true })}><Add /></button>

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create Product'}
                    >
                        <CreateProduct onHide={() => this.setState({ showAdd: false, reloadProducts: true })} />
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit Product'}
                    >
                        <EditProduct productId={selectedProduct} onHide={() => this.setState({ showEdit: false, reloadProducts: true })} />
                    </FormModel>
                </div>
            </div>
        )
    }
}

export default Products