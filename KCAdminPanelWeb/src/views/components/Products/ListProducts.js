import React, { useEffect,forwardRef,useImperativeHandle, useState } from 'react'
import { getLocalDate, makeAPICall } from '../../../services'
import { MoreHoriz } from '@material-ui/icons'
import { Loader } from '../../../shared'
import { toast } from 'react-toastify'
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core'

const ListProducts = forwardRef((props,ref)=> {

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useImperativeHandle(ref, () => ({
        onFilterChange(search,filters) {
          getSearchProducts(search,filters)
        },
      }));

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        props.hardReload && getProducts();
        props.hardReload && props.changeHardReload()
    }, [hardReload, props])

    const getProducts = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllProducts',
            query: `?size=${size}&page=${page}`
        })
        console.log(res)
        setProducts(res.data?.products || []);
        setIsLoading(false)
    }


    const getSearchProducts = async (searchTerm=null,filters=null, size = 100, page = 1) => {
        setIsLoading(true);
        let queryParams = `?size=${size}&page=${page}`
        if(searchTerm)
            queryParams =queryParams+`&searchTerm=${searchTerm}`
        if(filters)
            queryParams =queryParams+`&filters=${filters}`
        if(searchTerm !== '') {
            const res = await makeAPICall({
                endpoint: 'getSearchProducts',
                query: queryParams
            })
            console.log(res)
            setProducts(res.data?.products || []);
        }
        setIsLoading(false)
    }
    const handleActive = async (id, status) => {

        const postBody = {
            status: status
        }
        const response = await makeAPICall({
            endpoint: 'updateProduct',
            body: postBody,
            pathParam: `/${id}`
        })
        if(response.status) {
            toast.success(response.message);
            getProducts()
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
                            <TableCell>Product Id</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Buying Price</TableCell>
                            <TableCell>Display Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((product, idx) => 
                        <React.Fragment key={`${idx}`}>
                            <DataRow product={product} handleActive={handleActive} handleEdit={handleEdit} />
                        </React.Fragment>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
})

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
            <TableCell>#{props.product.productId}</TableCell>
            <TableCell className="text-capitalize">{props.product.productName}</TableCell>
            <TableCell>{getLocalDate(props.product.createdDate)}</TableCell>
            <TableCell>{props.product.categoryId?.categoryName}</TableCell>
            <TableCell>{props.product.buyingPrice}</TableCell>
            <TableCell>{props.product.displayPrice}</TableCell>
            <TableCell><span className={`badge${props.product.status ? '' : ' deactivated'}`}>{props.product.status ? 'ACTIVE' : 'DEACTIVATED'}</span></TableCell>
            <TableCell align="right">
                <MoreHoriz className="cursor-pointer" onClick={e => handleClick(e)} />
                <Menu
                    id={props.product.id}
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
                    <MenuItem onClick={() => props.handleActive(props.product.id, !props.product.status)}>{!props.product.status ? 'Activate' : 'De-Activate'}</MenuItem>
                    <MenuItem onClick={() => props.handleEdit(props.product.id)}>Edit</MenuItem> 
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default ListProducts
