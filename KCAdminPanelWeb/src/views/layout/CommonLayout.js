import React, { Component } from 'react'
import { Row } from 'react-bootstrap'
import { Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import { renderRoutes } from '../../configs/routes'
import { authService } from '../../services/auth'
import { Header } from '../components'
import * as userActions from './../../actions/userActions';
import SideMenu from '../components/SideMenu'
import { connect } from 'react-redux'
import './style.scss'
import { toast } from 'react-toastify'

export class CommonLayout extends Component {

    componentDidMount() {
        this.getCurrentUserInfo();   
        console.log(this.props)
    }

    getCurrentUserInfo = async() => {
        const userData = await authService.getUserData();
        if(userData.status === true) {
            this.props.userActions.loginUser(userData?.data);
        } else {
            toast.error('Redirecting to Login...')
            this.props.history.push('/login')
        }
    }

    render() {
        const { childRoutes = [] } = this.props

        if(!authService.isAuthenticated()) {
            return <Redirect to="login" />
        }

        return (
            <div>
                <Header />
                <div className="container-fluid p-0">
                    <div className="d-flex">
                        <SideMenu />
                        <Row className="p-4 m-0" style={{ flex: 1, background: '#E5E5E5', maxWidth: '100%' }}>
                            {childRoutes.length > 0 && renderRoutes(childRoutes)}
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        dispatch
    }
}

export default connect(null, mapDispatchToProps)(CommonLayout);
