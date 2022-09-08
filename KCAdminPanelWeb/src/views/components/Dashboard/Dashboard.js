import React, { Component } from 'react'
import './style.scss'
import { connect } from 'react-redux'


class Dashboard extends Component {
    render() {
        return (
            <div className={`main-content-wrapper position-relative`}>
                Dashboard
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      //  listUser: state.userReducer.getAllUser,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export { Dashboard }