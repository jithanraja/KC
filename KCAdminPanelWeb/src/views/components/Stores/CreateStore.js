import React, { useState } from 'react'
import { useFormik } from 'formik';
import { Input } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { storeValidationSchema } from './validationSchema';
import marker from './../../../assets/images/yellow-map-pin.svg';
import states from './../../../assets/states.json'
import cities from './../../../assets/cities.json'
import { MapView } from '../../../shared';

function CreateStore(props) {

    const [districts, setDistricts] = useState([])
    const [showMap, setShowMap] = useState(false)
    const [locationValue, setLocationValue] = useState('')

    const formik = useFormik({
        initialValues: {
            storeName: '',
            representative: '',
            contactNo: '',
            emailId: '',
            password: '',
            altContactNo: '',
            address: {
                doorNo: '',
                street: '',
                locality: '',
                area: '',
                state: '',
                district: '',
                pincode: '',
                location: '',
            }
        },
        validationSchema: storeValidationSchema,
        onSubmit: values => {
            // console.log(JSON.stringify(values, null, 2));
            createStore(values);
        },
    });

    const createStore = async(postData) => {
        const postBody = Object.assign({}, postData)
        if(postBody.altContactNo === '')
            delete postBody.altContactNo;
        postBody.address.location = {
            coordinates: postBody.address.location?.split(',').map(num => isNaN(num.trim()) ? 0 : Number(num.trim())).splice(0, 2)
        }
        console.log(postBody)
        const response = await makeAPICall({
            endpoint: 'createStore',
            body: postBody
        })
        if(response.status) {
            toast.success(response.message);
            props.onHide()
        } else {
            toast.error(response.message === "ValidationError" ? "Validation Error" : response.message);
        }
    }

    const handleLocationChange = (location) => {
        setLocationValue(location)
        formik.setFieldValue('address.location', location || '13.067439, 80.237617');
    }

    return (
        <div>
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">Store Info</div>
                <Row className="my-4 ">
                    {/*<Col md={6} sm={12}>
                        <Input
                            label="Store ID"
                            placeholder="Auto-Generated ID"
                            disabled={true} />
                    </Col>*/}
                    <Col md={6} sm={12}>
                        <Input 
                            name="storeName"
                            id="storeName"
                            onChange={formik.handleChange}
                            value={formik.values.storeName}
                            error={formik.errors.storeName}
                            isTouched={formik.touched.storeName}
                            isFormikSupported={true}
                            label="Store Name"
                            placeholder="Enter Store Name" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="representative"
                            id="representative"
                            onChange={formik.handleChange}
                            value={formik.values.representative}
                            error={formik.errors.representative}
                            isTouched={formik.touched.representative}
                            isFormikSupported={true}
                            label="Store Representative"
                            placeholder="Name" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="contactNo"
                            id="contactNo"
                            onChange={formik.handleChange}
                            value={formik.values.contactNo}
                            error={formik.errors.contactNo}
                            isTouched={formik.touched.contactNo}
                            isFormikSupported={true}
                            label="Contact"
                            placeholder="Contact Number" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="emailId"
                            id="emailId"
                            onChange={formik.handleChange}
                            value={formik.values.emailId}
                            error={formik.errors.emailId}
                            isTouched={formik.touched.emailId}
                            isFormikSupported={true}
                            type='email'
                            label="Email ID" />
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
                    <Col md={6} sm={12}>
                        <Input 
                            name="altContactNo"
                            id="altContactNo"
                            onChange={formik.handleChange}
                            value={formik.values.altContactNo}
                            error={formik.errors.altContactNo}
                            isTouched={formik.touched.altContactNo}
                            isFormikSupported={true}
                            label="Alternative Number"
                            placeholder="Contact Number" />
                    </Col>
                    
                </Row>
                <Row className="my-4">
                    <Col sm={12}>
                        <div className="secondary-title py-3 border-top">Address Details</div>
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="address.doorNo"
                            onChange={formik.handleChange}
                            value={formik.values.address.doorNo}
                            error={formik.errors.address?.doorNo}
                            isTouched={formik.touched.address?.doorNo}
                            isFormikSupported={true}
                            label="Door Number" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="address.street"
                            id="street"
                            onChange={formik.handleChange}
                            value={formik.values.address.street}
                            error={formik.errors.address?.street}
                            isTouched={formik.touched.address?.street}
                            isFormikSupported={true}
                            label="Street Address" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="address.locality"
                            id="locality"
                            onChange={formik.handleChange}
                            value={formik.values.address.locality}
                            error={formik.errors.address?.locality}
                            isTouched={formik.touched.address?.locality}
                            isFormikSupported={true}
                            label="Locality" />
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="address.area"
                            id="area"
                            onChange={formik.handleChange}
                            value={formik.values.address.area}
                            error={formik.errors.address?.area}
                            isTouched={formik.touched.address?.area}
                            isFormikSupported={true}
                            label="Area" />
                    </Col>
                    <Col md={6} sm={12}>
                        <label className="form-label">Select State</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('address.state', states[e.target.value]?.name)
                                formik.setFieldValue('address.district', '')
                                setDistricts(cities.filter((item, idx) => item.state_code === states[e.target.value]?.state_code))
                            }}>
                            <option value=''>Select State</option>
                            {states?.map((item, idx) => {
                                return <option key={`${idx}_states`} value={idx}>{item.name}</option>
                            })}
                        </select>
                        {formik.touched.address?.state && formik.errors.address?.state && <div className="pt-2 form-error text-danger">{formik.errors.address?.state}</div>}
                    </Col>
                    <Col md={6} sm={12}>
                        <label className="form-label">Select District</label>
                        <select className="form-control"
                            onChange={(e) => {
                                formik.setFieldValue('address.district', e.target.value)
                                // formik.setFieldValue('address.location', districts[e.target.value].latitude + ',' + districts[e.target.value].longitude);
                            }}>
                            <option value='' selected={formik.values.address.district === ''}>Select District</option>
                            {districts?.map((item, inx) => {
                                return <option key={`${inx}_districts`} value={item.name}>{item.name}</option>
                            })}
                        </select>
                        {formik.touched.address?.district && formik.errors.address?.district && <div className="pt-2 form-error text-danger">{formik.errors.address?.district}</div>}
                    </Col>
                    <Col md={6} sm={12}>
                        <Input 
                            name="address.pincode"
                            id="pincode"
                            onChange={formik.handleChange}
                            value={formik.values.address.pincode}
                            error={formik.errors.address?.pincode}
                            isTouched={formik.touched.address?.pincode}
                            isFormikSupported={true}
                            label="Pincode"
                            placeholder="Pincode" />
                    </Col>
                    <Col md={6} sm={12}>
                        <div className="location-input-container">
                            <Input 
                                name="address.location"
                                id="location"
                                onChange={formik.handleChange}
                                value={formik.values.address.location}
                                error={formik.errors.address?.location}
                                isTouched={formik.touched.address?.location}
                                isFormikSupported={true}
                                label="Location"
                                placeholder="Map"
                                readOnly={true}
                                onClick={() => setShowMap(true)} />
                            <img className="map-picker-marker" src={marker} alt="map marker icon" onClick={() => setShowMap(true)} />
                        </div>
                    </Col>                    
                </Row>
            </form>
            {showMap && <MapView
                show={showMap}
                onHide={() => setShowMap(false)}
                setPosition={(location) => handleLocationChange(location)}
                selectedValue={locationValue}
                title={'Select Location'}
            />}
        </div>
    )
}

export default CreateStore
