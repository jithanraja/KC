import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'

function ListUsers(props) {

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        hardReload && getUsers();
        hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getUsers = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllUsers',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setUsers(res.data?.users || []);
        setIsLoading(false)
    }

    const handleActive = async (id, active) => {
        console.log(id, active);
        const postBody = {
            isActive: active
        }
        const response = await makeAPICall({
            endpoint: 'updateUser',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getUsers()
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
                            <TableCell>User Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((user, idx) => <React.Fragment key={`${idx}`}>
                        <DataRow user={user} idx={idx+1} handleActive={handleActive} handleEdit={handleEdit} />
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
            <TableCell>#{props.idx}</TableCell>
            <TableCell className="text-capitalize">{`${props.user.firstName} ${props.user.lastName}`}</TableCell>
            <TableCell>{getLocalDate(props.user.createdDate)}</TableCell>
            <TableCell className="text-capitalize">{props.user.role}</TableCell>
            <TableCell><span className={`badge${props.user.isActive ? '' : ' deactivated'}`}>{props.user.isActive ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.user.id}
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
                    <MenuItem onClick={() => props.handleActive(props.user.id, !props.user.isActive)}>{!props.user.isActive ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.user.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListUsers
