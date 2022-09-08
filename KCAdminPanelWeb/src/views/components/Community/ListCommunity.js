import React, { useEffect, useState } from 'react'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'

function ListCommunity(props) {

    const [communities, setCommunities] = useState([
        {
            communityId: 1,
            communityName: 'Test1',
            communityAdmin: 'Suresh',
            isActive: true,
            createdDate: '2021-12-25T14:28:27.621+00:00'
        },
        {
            communityId: 2,
            communityName: 'Test2',
            communityAdmin: 'Kumar',
            isActive: false,
            createdDate: '2021-11-28T14:28:27.621+00:00'
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
        // getCommunity();
    }, [])

    useEffect(() => {
        props.hardReload && getCommunity();
        props.hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getCommunity = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllCommunity',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setCommunities(res.data?.communities || []);
        setIsLoading(false)
    }

    const handleActive = async (id, status) => {
        return;
        const postBody = {
            isActive: status
        }
        const response = await makeAPICall({
            endpoint: 'updateCommunity',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getCommunity()
        } else {
            toast.error(response.message);
        }
    }

    const handleEdit = async (id) => {
        return;
        props.enableEdit(id)
    }

    return (
        <div className="mt-4 mb-5">
            {isLoading && <Loader containerHeight={true} />}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Community Id</TableCell>
                            <TableCell>Community Name</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {communities.map((community, idx) => 
                        <React.Fragment key={`${idx}`}>
                            <DataRow community={community} handleActive={handleActive} handleEdit={handleEdit} />
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
            <TableCell>#{props.community.communityId}</TableCell>
            <TableCell className="text-capitalize">{props.community.communityName}</TableCell>
            <TableCell>{getLocalDate(props.community.createdDate)}</TableCell>
            <TableCell className="text-capitalize">{props.community.communityAdmin}</TableCell>
            <TableCell><span className={`badge${props.community.isActive ? '' : ' deactivated'}`}>{props.community.isActive ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.community.id}
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
                    <MenuItem onClick={() => props.handleActive(props.community.id, !props.community.isActive)}>{!props.community.isActive ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.community.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListCommunity
