import React from 'react'
import { useFormik } from 'formik';
import { Input } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { userValidationSchema } from './validationSchema';
import profile from './../../../assets/images/profile.svg'

function CreateUser(props) {

    const roleOptions = [
        {
            name: 'Admin',
            value: 'superadmin'
        },
        {
            name: 'User',
            value: 'user'
        }, 
        // {
        //     name: 'Product Admin',
        //     value: 'productadmin'
        // }, 
        // {
        //     name: 'Store Admin',
        //     value: 'storeadmin'
        // }, 
        // {
        //     name: 'Super Admin',
        //     value: 'superadmin'
        // }
    ]

    const formik = useFormik({
        initialValues: {
            firstName: '', 
            lastName: '',
            username: '',
            password: '',
            role: '',
            mobileNo: '',
            altMobileNo: ''
        },
        validationSchema: userValidationSchema,
        onSubmit: values => {
            // console.log(JSON.stringify(values, null, 2));
            createUser(values);
        },
    });

    const createUser = async(postData) => {
        const postBody = Object.assign({}, postData)
        if(postBody.altMobileNo === '')
            delete postBody.altMobileNo;
        const response = await makeAPICall({
            endpoint: 'createUser',
            body: postBody
        })
        if(response.status) {
            toast.success(response.message);
            props.onHide()
        } else {
            toast.error(response.message === "ValidationError" ? "Validation Error" : response.message);
        }
    }

    return (
        <div>
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">User Info</div>
                <div className="text-center">
                    <div className="gray-circle">
                        <img src={profile} width={80} alt="user profile" />
                    </div>
                </div>
                <Row className="my-4">
                    <Col md={6} sm={12}>
                        <Input 
                            name="firstName"
                            id="firstName"
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            error={formik.errors.firstName}
                            isTouched={formik.touched.firstName}
                            isFormikSupported={true}
                            label="First Name"
                            placeholder="Enter First Name" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="lastName"
                            id="lastName"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            error={formik.errors.lastName}
                            isTouched={formik.touched.lastName}
                            isFormikSupported={true}
                            label="Last Name"
                            placeholder="Enter Last Name" />
                    </Col>
                </Row>
                <Row className="my-4">
                    <Col md={6} sm={12}>
                        <label className="form-label">Select Role (Admin, User)</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('role', e.target.value)
                            }}>
                            <option value=''>Select Role</option>
                            {roleOptions.map((item, idx) =>
                                <option value={item.value} selected={item.value === formik.values.role}>{item.name}</option>        
                            )}
                        </select>
                        {formik.touched.role && formik.errors.role && <div className="pt-2 form-error text-danger">{formik.errors.role}</div>}
                    </Col>
                </Row>
                <Row className="my-4">
                    <Col sm={12}>
                        <div className="secondary-title py-4 border-top">Credentials</div>
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="username"
                            id="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            error={formik.errors.username}
                            isTouched={formik.touched.username}
                            isFormikSupported={true}
                            type='email'
                            label="Email Address / Username"
                            placeholder="Email Address" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="password"
                            id="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            error={formik.errors.password}
                            isTouched={formik.touched.password}
                            isFormikSupported={true}
                            label="Password"
                            type="password"
                            placeholder="Password" />
                    </Col>
                </Row>
                <Row className="my-4">
                    <Col sm={12}>
                        <div className="secondary-title py-3 border-top">Contact Info</div>
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="mobileNo"
                            id="mobileNo"
                            onChange={formik.handleChange}
                            value={formik.values.mobileNo}
                            error={formik.errors.mobileNo}
                            isTouched={formik.touched.mobileNo}
                            isFormikSupported={true}
                            label="Mobile Number"
                            placeholder="Mobile Number" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="altMobileNo"
                            id="altMobileNo"
                            onChange={formik.handleChange}
                            value={formik.values.altMobileNo}
                            error={formik.errors.altMobileNo}
                            isTouched={formik.touched.altMobileNo}
                            isFormikSupported={true}
                            label="Alternate Contact Number"
                            placeholder="Alternate Number" />
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default CreateUser
