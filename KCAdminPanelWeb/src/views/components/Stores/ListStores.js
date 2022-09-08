import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'

function ListStores(props) {

    const [stores, setStores] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
        getStores();
    }, [])

    useEffect(() => {
        hardReload && getStores();
        hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getStores = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllStores',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setStores(res.data?.stores || []);
        setIsLoading(false)
    }

    const handleActive = async (id, active) => {
        console.log(id, active);
        const postBody = {
            isActive: active
        }
        const response = await makeAPICall({
            endpoint: 'updateStore',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getStores()
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
                            <TableCell>Store Id</TableCell>
                            <TableCell>Store Name</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {stores.map((store, idx) => <React.Fragment key={`${idx}`}>
                        <DataRow store={store} idx={idx+1} handleActive={handleActive} handleEdit={handleEdit} />
                    </React.Fragment>)}
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
            <TableCell>#{props.store.storeId}</TableCell>
            <TableCell className="text-capitalize">{`${props.store.storeName}`}</TableCell>
            <TableCell>{getLocalDate(props.store.createdDate)}</TableCell>
            <TableCell><span className={`badge${props.store.isActive ? '' : ' deactivated'}`}>{props.store.isActive ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.store.id}
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
                    <MenuItem onClick={() => props.handleActive(props.store.id, !props.store.isActive)}>{!props.store.isActive ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.store.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListStores
