import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { CancelButton, SubmitButton } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';

function FilterProduct(props) {

    const [categories, setCategories] = useState([])
    const [statusItems, setStatusItems] = useState([{status:'',name:'All'},{status:'true',name:'Active'},{status:'false',name:'Inactive'}])
    const [isLoading, setIsLoading] = useState(false)
    const { hardReload } = props

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        props.hardReload && getCategories();
        props.hardReload && props.changeHardReload()
    }, [hardReload, props])
    const formik = useFormik({
        initialValues: {
            categoryId:props.selectValue.categoryId,
            status: props.selectValue.status,
        },
        onSubmit: values => {
           let filterValue =[]    
            Object.keys(values).forEach(element=>{
                if(values[element])
                    filterValue.push({ key:element,value:values[element]})
            })
            console.log(filterValue)
            props.handleFilter(filterValue)
        },
    });

    const getCategories = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllCategories',
            query: `?size=${size}&page=${page}`
        })
        setCategories(res.data?.categories || []);
        setIsLoading(false)
    }

    return (
        <div className="m-4">
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">Filter Info</div>
                <Row className="my-4">
                    <Col md={6} sm={12}>
                        <label className="form-label">Select Category</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('categoryId', e.target.value)
                            }}>
                            <option value=''>All</option>
                            {categories.map((item, idx) =>
                                <option key={"cat" + idx} value={item.id} selected={item.id === formik.values.categoryId}>{item.categoryName}</option>
                            )}
                        </select>
                        {formik.touched.categoryId && formik.errors.categoryId && <div className="pt-2 form-error text-danger">{formik.errors.categoryId}</div>}
                    </Col>
                    <Col md={6} sm={12}>
                        <label className="form-label">Select status</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('status', e.target.value)
                            }}>
                            {statusItems.map((item, idx) =>
                                <option key={"cate" + idx} value={item.status} selected={item.status === formik.values.status}>{item.name}</option>
                            )}
                        </select>
                        {formik.touched.status && formik.errors.status && <div className="pt-2 form-error text-danger">{formik.errors.status}</div>}
                    </Col>
                </Row>

            </form>
            <div className="border-top py-2 row   m-auto">
                <div className="mr-2 ml-2 mt-2">
                    <CancelButton onClick={props.onCancel}>
                        CANCEL
                    </CancelButton>
                </div>
                <div className="mr-2 ml-2 mt-2">
                    <SubmitButton onClick={props.onHide} form="formik-form" type="submit">
                        FILTER
                    </SubmitButton>
                </div>
            </div>
        </div>

    )
}

export default FilterProduct
