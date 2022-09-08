import { Tab, Tabs, Box } from '@material-ui/core';
import React, { Component } from 'react'
import { Loader } from '../../../shared';
import ListOrders from './ListOrders';
import './style.scss'
import OrderDetails from './OrderDetails';

export class Orders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openOrders: [{
                orderId: 1,
                customerName: 'Sam',
                createdDate: new Date(),
                amount: 10,
                status: 'ordered'
            }, {
                orderId: 2,
                customerName: 'Raj',
                createdDate: new Date(),
                amount: 20,
                status: 'declined'
            }, {
                orderId: 3,
                customerName: 'John',
                createdDate: new Date(),
                amount: 10,
                status: 'assigned'
            }],
            completedOrders: [{
                orderId: 5,
                customerName: 'Jimmy',
                createdDate: new Date(),
                amount: 10,
                status: 'completed'
            }, {
                orderId: 8,
                customerName: 'Robert',
                createdDate: new Date(),
                amount: 10,
                status: 'completed'
            }, {
                orderId: 10,
                customerName: 'Bean',
                createdDate: new Date(),
                amount: 10,
                status: 'completed'
            }],
            isLoading: false,
            tabIndex: 0,
            selectedOrder: null
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ tabIndex: newValue });
    };

    setSelectedOrder = (order) => {
        this.setState({ selectedOrder: order });
    }

    render() {
        const { isLoading, openOrders, completedOrders, tabIndex, selectedOrder } = this.state;

        return (
            <div className={`main-content-wrapper position-relative ${selectedOrder && 'orders-details'}`}>
                {selectedOrder 
                    ? <OrderDetails order={selectedOrder} setSelectedOrder={this.setSelectedOrder} />
                    : <div className="orders-container">
                        {isLoading && <Loader containerHeight={true} />}
                        <Tabs value={tabIndex} onChange={this.handleChange}>
                            <Tab label="Open" aria-controls={`tabpanel-0`} id={`tab-0`} />
                            <Tab label="Completed" aria-controls={`tabpanel-1`} id={`tab-1`} />
                        </Tabs>
                        <div className="tab-section">
                            <div className="primary-title p-3">
                                <span>Orders</span>
                            </div>

                            <TabPanel value={tabIndex} index={0}>
                                <ListOrders 
                                    data={openOrders} 
                                    setSelectedOrder={this.setSelectedOrder} />
                            </TabPanel>
                            <TabPanel value={tabIndex} index={1}>
                                <ListOrders 
                                    data={completedOrders} 
                                    completed={true} 
                                    setSelectedOrder={this.setSelectedOrder} />
                            </TabPanel>
                        </div>
                    </div>}
            </div>
        )
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={1}>
            {children}
          </Box>
        )}
      </div>
    );
  }

export default Orders