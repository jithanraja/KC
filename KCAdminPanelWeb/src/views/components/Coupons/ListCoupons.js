import React, { useEffect, useState } from 'react'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'

const ListCoupons =(props)=> {

    const [coupons, setCoupons] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
       getCoupons();
    }, [])

    useEffect(() => {
        props.hardReload && getCoupons();
        props.hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getCoupons = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllCoupons',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setCoupons(res.data?.coupons || []);
        setIsLoading(false)
    }


    const handleActive = async (id, status) => {

        const postBody = {
            status: status
        }
        const response = await makeAPICall({
            endpoint: 'updateCoupon',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getCoupons()
        } else {
            toast.error(response.message);
        }
    }

    const handleEdit = async (id) => {
        props.enableEdit(id)
    }

    return (
        <div className="mt-4 mb-5">
            {isLoading && <Loader containerHeight={true} />}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {coupons.map((coupon, idx) => 
                        <React.Fragment key={`${idx}`}>
                            <DataRow coupon={coupon} handleActive={handleActive} handleEdit={handleEdit} />
                        </React.Fragment>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
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
            <TableCell>#{props.coupon.couponCode}</TableCell>
            <TableCell className="text-capitalize">{props.coupon.couponName}</TableCell>
            <TableCell>{getLocalDate(props.coupon.createdDate)}</TableCell>
            <TableCell className="text-capitalize">{props.coupon.modifiedBy || props.coupon.createdBy}</TableCell>
            <TableCell><span className={`badge${props.coupon.status ? '' : ' deactivated'}`}>{props.coupon.status ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.coupon.id}
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
                    <MenuItem onClick={() => props.handleActive(props.coupon.id, !props.coupon.status)}>{!props.coupon.status ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.coupon.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListCoupons
