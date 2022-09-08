import React from 'react'
import { getLocalDate } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'

function ListOrders(props) {

    const orders = props.data;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Orders Id</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Ordered</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {orders.map((order, idx) => 
                    <React.Fragment key={`${idx}`}>
                        <DataRow order={order} completed={props.completed} setSelectedOrder={props.setSelectedOrder} />
                    </React.Fragment>
                )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function DataRow(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <TableRow className="border-bottom">
            <TableCell>#{props.order.orderId}</TableCell>
            <TableCell className="text-capitalize">{props.order.customerName}</TableCell>
            <TableCell>{getLocalDate(props.order.createdDate)}</TableCell>
            <TableCell>{props.order.amount}</TableCell>
            <TableCell><span className={`badge text-uppercase status-${props.order?.status?.toLowerCase()}`}>{props.completed ? 'COMPLETED' : props.order.status}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.order.id}
                    anchorEl={anchorEl}
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
                    }}>
                    <MenuItem onClick={() => { props.setSelectedOrder(props.order) }}>View</MenuItem> 
                    <MenuItem onClick={() => {
                        // props.handleEdit(props.order.id)
                    }}>Edit</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListOrders
