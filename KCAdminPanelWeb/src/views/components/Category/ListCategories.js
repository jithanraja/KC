import React, { useEffect, useState } from 'react'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'

function ListCategories(props) {

    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        props.hardReload && getCategories();
        props.hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getCategories = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllCategories',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setCategories(res.data?.categories || []);
        setIsLoading(false)
    }

    const handleActive = async (id, status) => {
        const postBody = {
            isActive: status
        }
        const response = await makeAPICall({
            endpoint: 'updateCategory',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getCategories()
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
                            <TableCell>Category Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {categories.map((category, idx) => 
                        <React.Fragment key={`${idx}`}>
                            <DataRow category={category} handleActive={handleActive} handleEdit={handleEdit} />
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
            <TableCell>#{props.category.categoryId}</TableCell>
            <TableCell className="text-capitalize">{props.category.categoryName}</TableCell>
            <TableCell>{getLocalDate(props.category.createdDate)}</TableCell>
            <TableCell><span className={`badge${props.category.isActive ? '' : ' deactivated'}`}>{props.category.isActive ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.category.id}
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
                    <MenuItem onClick={() => props.handleActive(props.category.id, !props.category.isActive)}>{!props.category.isActive ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.category.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListCategories
