import React, { Component } from 'react';
import { Button, Row } from 'react-bootstrap';
import logo from './../../../assets/images/KC-logo-login.png'
import basket from './../../../assets/images/basket-vegetables.png'
import vegetables from './../../../assets/images/vegetables.png'
import mobileVegetables from './../../../assets/images/mobile-with-vegetables.png'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './style.scss'
import { authService } from '../../../services/auth';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import * as userActions from '../../../actions/userActions';
import { bindActionCreators } from 'redux';
import { HIDE_LOADER, SHOW_LOADER } from '../../../stores/types';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: ''
        }
    }

    handleSignIn = async () => {
        const { username, password } = this.state;
        if(username === '' || password === '') {
            this.setState({
                errorMessage: "Username / Password can't be empty"
            })
        } else {
            this.props.dispatch({ type: SHOW_LOADER })
            const response = await makeAPICall({
                endpoint: 'adminLogin',
                body: {
                    username,
                    password
                }
            })
            if(response?.status) {
                toast.success(response?.message)
                authService.setAuthToken(response?.data.token);
                this.props.userActions.loginUser(response?.data);
                this.props.dispatch({ type: HIDE_LOADER })
                this.props.history.push('/dashboard')
            } else {
                this.props.dispatch({ type: HIDE_LOADER })
                this.setState({
                    errorMessage: response?.message
                })
            }
        }

        
    }

    handleInputChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    render() { 
        const { username, password, errorMessage } = this.state;
        return (
            <div className="container-fluid">
                <Row>
                    <div className="col-md-6 p-0" style={{height: '100vh', overflow: 'hidden'}}>
                        <Carousel showStatus={false} infiniteLoop showArrows={false} swipeable autoPlay interval={4000} >
                            <div className='blue-backdrop'>
                                <div className="slide-container d-flex flex-column justify-content-center">
                                    <img src={vegetables} alt="welcome" />
                                    <h3>Welcome</h3>
                                </div>
                            </div>
                            <div className="red-backdrop">
                                <div className="slide-container d-flex flex-column justify-content-center">
                                    <img src={basket} alt="order" />
                                    <h3>Order</h3>
                                </div>
                            </div>
                            <div className="dark-blue-backdrop">
                                <div className="slide-container d-flex flex-column justify-content-center">
                                    <img src={mobileVegetables} alt="delivery" />
                                    <h3>Delivery</h3>
                                </div>
                            </div>
                        </Carousel>
                    </div>
                    <div className="col-md-6 p-0 form-container d-flex flex-column justify-content-center">
                        <div className="text-center">
                            <img src={logo} alt="logo" style={{width: 200}} />
                        </div>
                        <h5 className="mb-4 mt-5 font-weight-bolder">Sign in</h5>
                        <div className="form-group">
                            {/*<label className="form-label">Username</label>*/}
                            <input type="text" name="username" value={username} onChange={(e) => this.handleInputChange(e)} className="form-control py-2" placeholder="Email" autoFocus />
                        </div>
                        <div className="form-group mt-2">
                            {/*<label className="form-label">Password</label>*/}
                            <input type="password" name="password" value={password} onChange={(e) => this.handleInputChange(e)} className="form-control py-2" placeholder="Password" autoComplete='new-password' />
                        </div>
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                        <div className="form-group mt-4">
                            <Button variant="info" className="d-block signin-btn" onClick={this.handleSignIn}>SIGN IN</Button>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
