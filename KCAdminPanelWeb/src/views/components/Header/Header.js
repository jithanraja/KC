import { Menu, MenuItem } from '@material-ui/core'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { authService } from '../../../services/auth'
import KCLogo from './../../../assets/images/KC_Logo.png'
import Notification from './../../../assets/images/notification.svg'
import downArrow from './../../../assets/images/select-arrow.svg'
import profile from './../../../assets/images/profile.svg'
import './style.scss'
import { useSelector } from 'react-redux'

function Header(props) {

    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const user = useSelector((state) => state.userReducer.user)
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav className="navbar navbar-light">
            <Link className="navbar-brand" to="/dashboard">
                <img src={KCLogo} alt="KC header logo" width={112} height={60} />
            </Link>
            <ul className="nav">
                <li className="nav-item border-right pr-4">
                    <img src={Notification} alt="notification"/>
                </li>
                <li className="nav-item pl-4">
                    <div className="d-flex align-items-center">
                        <img src={profile} width={35} alt="profile" />
                        <div onClick={handleClick} className="cursor-pointer d-flex" style={{lineHeight: 'normal'}}>
                            <span className="mx-2 text-info text-uppercase">{user?.firstName} {user?.lastName}</span>
                            <img src={downArrow} alt="down arrow"/>
                        </div>
                    
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem alignItems='center' onClick={() => authService.handleLogout(history)}>Logout</MenuItem>
                        </Menu>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Header
export { Header }