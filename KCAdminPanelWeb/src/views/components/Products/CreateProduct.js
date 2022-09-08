import React, { useEffect, useState,useReducer } from 'react'
import { useFormik } from 'formik';
import { Input } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { productValidationSchema } from './validationSchema';
import camera from './../../../assets/images/file-camera.svg'
import { API_BASE_URL } from "../../../configs"
import { Add, Remove } from '@material-ui/icons'

function CreateProduct(props) {
    const [productImage, setProductImage] = useState('');
    const [imagePath, setImagePath] = useState(camera);
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const units = ['kg', 'pcs', 'ltrs']
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
            productName: '',
            productImage: '',
            categoryId: '',
            buyingPrice: '',
            displayPrice: '',
            maxDiscount: '',
            unitType: '',
            slabs: [{
                from: '',
                to: '',
                unitPrice: ''
            }]
        },
        validationSchema: productValidationSchema,
        onSubmit: values => {
            createProduct(values);
        },
    });

    const createProduct = async (postData) => {
        const postBody = Object.assign(postData, { productImage: productImage })
        console.log(postData)
        const response = await makeAPICall({
            endpoint: 'createProduct',
            body: postBody
        })
        if (response.status) {
            toast.success(response.message);
            props.onHide()
        } else {
            toast.error(response.message === "ValidationError" ? "Validation Error" : response.message);
        }
    }
    const getCategories = async (size = 100, page = 1) => {
        setIsLoading(true);
        const res = await makeAPICall({
            endpoint: 'getAllCategories',
            query: `?size=${size}&page=${page}`
        })
        setCategories(res.data?.categories || []);
        setIsLoading(false)
    }

    const uploadFile = async (e) => {
        const file = e.target.files;
        let formData = new FormData();
        if (file.length > 0) {
            for (var i = 0; i < file.length; i++) {
                formData.append("uploads[]", file[i], file[i].name);
            }
            const response = await makeAPICall({
                endpoint: 'productUploadFile',
                body: formData
            })
            if (response.status) {
                const url = API_BASE_URL + '/' + response.path
                setImagePath(url)
                setProductImage(response.path)
                toast.success(response.message);
                // props.onHide()
            } else {
                //  props.onHide()
                toast.error(response.message);
            }
        }
    }

    const addSlab = (i) => {
        formik.values.slabs.push({ from: '', to: '', unitPrice: '' })
        forceUpdate();
    }

    const removeSlab = (index) => {
        const filterArray = formik.values.slabs.filter((item, i) => i !== index);
        formik.values.slabs=filterArray
        forceUpdate();
    }
    
    return (
        <div>
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">Product Info</div>
                <div className="text-center">
                    <div className="rectangle-bg py-3">
                        <input className='file-upload' id="choose_pic" onChange={(e) => uploadFile(e)} type="file" accept='image/*' />
                        <img src={imagePath} width={64} alt="user profile" />
                        <div className="image-label my-1">Select Product Image</div>
                    </div>
                </div>
                <Row className="my-4">
                    {/*<Col md={6} sm={12}>
                        <Input
                            name="productId"
                            id="productId"
                            onChange={formik.handleChange}
                            value={formik.values.productId}
                            error={formik.errors.productId}
                            isTouched={formik.touched.productId}
                            isFormikSupported={true}
                            label="Product Id"
                            placeholder='Auto-Generated ID'
                            disabled={true}
                        />
                    </Col>*/}
                    <Col md={6} sm={12}>
                        <Input
                            name="productName"
                            id="productName"
                            onChange={formik.handleChange}
                            value={formik.values.productName}
                            error={formik.errors.productName}
                            isTouched={formik.touched.productName}
                            isFormikSupported={true}
                            label="Product Name"
                            placeholder="Enter First Name" />
                    </Col>
                    <Col md={6} sm={12}>
                        <label className="form-label">Select Category</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('categoryId', e.target.value)
                            }}>
                            <option value=''>Select Category</option>
                            {categories.map((item, idx) =>
                                <option key={"cat" + idx} value={item.id} selected={item.id === formik.values.categoryId}>{item.categoryName}</option>
                            )}
                        </select>
                        {formik.touched.categoryId && formik.errors.categoryId && <div className="pt-2 form-error text-danger">{formik.errors.categoryId}</div>}
                    </Col>
                </Row>
                <div className="secondary-title my-3">Price Info</div>
                <Row className="my-4">
                    <Col md={6} sm={12}>
                        <Input
                          type={'number'}
                            name="buyingPrice"
                            id="buyingPrice"
                            onChange={formik.handleChange}
                            value={formik.values.buyingPrice}
                            error={formik.errors.buyingPrice}
                            isTouched={formik.touched.buyingPrice}
                            isFormikSupported={true}
                            label="Buying Price"
                            placeholder='Buying Price'
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input
                          type={'number'}
                            name="displayPrice"
                            id="displayPrice"
                            onChange={formik.handleChange}
                            value={formik.values.displayPrice}
                            error={formik.errors.displayPrice}
                            isTouched={formik.touched.displayPrice}
                            isFormikSupported={true}
                            label="Display Price"
                            placeholder="Enter Display Price" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input
                          type={'number'}
                            name="maxDiscount"
                            id="maxDiscount"
                            onChange={formik.handleChange}
                            value={formik.values.maxDiscount}
                            error={formik.errors.maxDiscount}
                            isTouched={formik.touched.maxDiscount}
                            isFormikSupported={true}
                            label="Maximum Discount"
                            placeholder='Maximum Discount'
                        />
                    </Col>
                    <Col md={6} sm={12}>
                    <label className="form-label">Select Unit</label>
                            <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('unitType', e.target.value)
                            }}>
                            <option value=''>Select unit</option>
                            {units.map((item, idx) =>
                                <option key={"cate" + idx} value={item} selected={item === formik.values.unitType}>{item}</option>
                            )}
                        </select>
                        {formik.touched.unitType && formik.errors.unitType && <div className="pt-2 form-error text-danger">{formik.errors.unitType}</div>}
                    </Col>
                </Row>

                <div className="secondary-title my-3">SLAB</div>
                {formik.values.slabs && formik.values.slabs.map((item, i) => (<Row className="my-1" key={i}>
                    <Col md={3} sm={6}>
                        <Input
                          type={'number'}
                            name={`slabs.${i}.from`}
                            id={`slabs.${i}.from`}
                            onChange={formik.handleChange}
                            value={formik.values.slabs[i].from}
                            error={(formik.errors?.slabs) ? formik.errors.slabs[i]?.from : ''}
                            isTouched={(formik?.touched?.slabs) ? formik.touched.slabs[i]?.from : false}
                            isFormikSupported={true}
                            label="From"
                            placeholder='From'
                        />
                    </Col>
                    <Col md={3} sm={6}>
                        <Input
                          type={'number'}
                            name={`slabs.${i}.to`}
                            id={`slabs.${i}.to`}
                            onChange={formik.handleChange}
                            value={formik.values.slabs[i].to}
                            error={(formik.errors?.slabs) ? formik.errors?.slabs[i]?.to : ''}
                            isTouched={(formik?.touched?.slabs) ? formik.touched.slabs[i]?.to : false}
                            isFormikSupported={true}
                            label="To"
                            placeholder="to" />
                    </Col>
                    <Col md={3} sm={6}>
                        <Input
                           type={'number'}
                            name={`slabs.${i}.unitPrice`}
                            id={`slabs.${i}.unitPrice`}
                            onChange={formik.handleChange}
                            value={formik.values.slabs[i].unitPrice}
                             error={(formik.errors?.slabs) ? formik.errors.slabs[i]?.unitPrice : ''}
                            isTouched={(formik?.touched?.slabs) ? formik.touched.slabs[i]?.unitPrice : false}
                            isFormikSupported={true}
                            label="Unit Price"
                            placeholder='Unit Price'
                        />
                    </Col>
                    <Col md={3} sm={6}>
                        <div className="slab-button-container">
                            <button type='button' className="add-slab-button" onClick={() => addSlab(formik.values.slabs.length)}><Add /></button>
                            {i !== 0 ? <button type='button' className="remove-slab-button" onClick={() => removeSlab(i)}><Remove /></button> : ''}
                        </div>
                    </Col>
                </Row>))}
            </form>
        </div>
    )
}

export default CreateProduct
