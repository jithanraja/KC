import React, { useState } from 'react'
import { useFormik } from 'formik';
import { Input } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { couponValidationSchema } from './validationSchema';
import camera from './../../../assets/images/file-camera.svg'
import { API_BASE_URL } from "../../../configs"

function CreateCoupon(props) {

    const [couponImage, setCouponImage]= useState('');
    const [imagePath, setImagePath]= useState(camera);
    const formik = useFormik({
        initialValues: {
            couponName: '',
            couponCode: '',
            couponDescription: '',
            percentage: ''
        },
        validationSchema: couponValidationSchema,
        onSubmit: values => {
         createCoupon(values);
        },
    });

    const createCoupon = async (postData) => {
        const postBody = Object.assign(postData, { imageURL: couponImage })
        console.log(postData)
        const response = await makeAPICall({
            endpoint: 'createCoupon',
            body: postBody
        })
        if (response.status) {
            toast.success(response.message);
            props.onHide()
        } else {
            toast.error(response.message === "ValidationError" ? "Validation Error" : response.message);
        }
    }

    const uploadFile = async (e) => {
        const file = e.target.files;
        let formData = new FormData();
        if (file.length > 0) {
            for (var i = 0; i < file.length; i++) {
                formData.append("uploads[]", file[i], file[i].name);
            }
            const response = await makeAPICall({
                endpoint: 'uploadFile',
                body: formData
            })
            if (response.status) {
                const url= API_BASE_URL + '/' + response.path
                setImagePath(url)
                setCouponImage(response.path)
                toast.success(response.message);
               // props.onHide()
            } else {
              //  props.onHide()
                toast.error(response.message);
            }
        }
    }

    return (
        <div>
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">Coupon Info</div>
                <Row className="my-4">
                  
                    <Col md={6} sm={12}>
                        <Input
                            name="couponName"
                            id="couponName"
                            onChange={formik.handleChange}
                            value={formik.values.couponName}
                            error={formik.errors.couponName}
                            isTouched={formik.touched.couponName}
                            isFormikSupported={true}
                            label="Coupon Name"
                            placeholder="Enter Coupon Name" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input
                            name="couponCode"
                            id="couponCode"
                            onChange={formik.handleChange}
                            value={formik.values.couponCode}
                            error={formik.errors.couponCode}
                            isTouched={formik.touched.couponCode}
                            isFormikSupported={true}
                            label="Coupon Code"
                            placeholder='Coupon Code'
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input
                            name="couponDescription"
                            id="couponDescription"
                            onChange={formik.handleChange}
                            value={formik.values.couponDescription}
                            error={formik.errors.couponDescription}
                            isTouched={formik.touched.couponDescription}
                            isFormikSupported={true}
                            label="Coupon Description"
                            placeholder='Coupon Description'
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input
                            type={'number'}
                            name="percentage"
                            id="percentage"
                            onChange={formik.handleChange}
                            value={formik.values.percentage}
                            error={formik.errors.percentage}
                            isTouched={formik.touched.percentage}
                            isFormikSupported={true}
                            label="Coupon %"
                            placeholder='Coupon %'
                        />
                    </Col>
                </Row>
            </form>
            <hr />
            <div className="my-3 font-weight-bold">Image Upload</div>
            <div className="text-center">
                <div className="rectangle-bg py-3 w-100">
                    <input className='file-upload' id="choose_pic" onChange={(e) => uploadFile(e)} type="file" accept='image/*' />
                    <img src={imagePath} width={64} alt="coupon" />
                    <div className="image-label my-1">Image Upload</div>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default CreateCoupon
