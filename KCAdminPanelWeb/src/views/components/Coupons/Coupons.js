import { Add } from '@material-ui/icons'
import React, { Component } from 'react'
import { FormModel } from '../../../shared';
import CreateCoupon from './CreateCoupon';
import EditCoupon from './EditCoupon';
import ListCoupons from './ListCoupons'
import './style.scss'

export class Coupons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAdd: false,
            showEdit: false,
            selectedCoupon: '',
            reloadCoupons: false,
        }
    }

    changeHardReload = () => {
        this.setState({ reloadCoupons: false })
    }

    enableEdit = (id) => {
        this.setState({
            selectedCoupon: id,
            showEdit: true
        })
    }
  

    render() {

        const { showAdd, showEdit, reloadCoupons, selectedCoupon } = this.state;

        return (
            <div className={`main-content-wrapper position-relative`}>
                <div className="mx-3">
                    <div className="primary-title">
                        <span>Coupons</span>
                    </div>
                    <ListCoupons
                        hardReload={reloadCoupons}
                        changeHardReload={this.changeHardReload}
                        enableEdit={this.enableEdit}
                    />
                    <button className="add-button" onClick={() => this.setState({ showAdd: true })}><Add /></button>

                    <FormModel
                        show={showAdd}
                        onHide={() => this.setState({ showAdd: false })}
                        submitButtonText={'CREATE'}
                        title={'Create Coupon'}
                    >
                        <CreateCoupon onHide={() => this.setState({ showAdd: false, reloadCoupons: true })} />
                    </FormModel>

                    <FormModel
                        show={showEdit}
                        onHide={() => this.setState({ showEdit: false })}
                        submitButtonText={'SAVE'}
                        title={'Edit Coupon'}
                    >
                        <EditCoupon couponId={selectedCoupon} onHide={() => this.setState({ showEdit: false, reloadCoupons: true })} />
                    </FormModel>
                </div>
            </div>
        )
    }
}

export default Coupons