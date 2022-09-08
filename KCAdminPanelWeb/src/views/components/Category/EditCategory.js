import React, { useEffect,useState } from 'react'
import { useFormik } from 'formik';
import { Input } from '../../../shared';
import { Col, Row } from 'react-bootstrap';
import { makeAPICall } from '../../../services';
import { toast } from 'react-toastify';
import { categoryValidationSchema } from './validationSchema';
import camera from './../../../assets/images/file-camera.svg'
import { API_BASE_URL } from "../../../configs"

function EditCategory(props) {

    const [categoryImage, setCategoryImage]= useState('');
    const [imagePath, setImagePath]= useState(camera);
    const formik = useFormik({
        initialValues: {
            categoryName: '',
        },
        enableReinitialize: true,
        validationSchema: categoryValidationSchema,
        onSubmit: values => {
            // console.log(JSON.stringify(values, null, 2));
            updateCategories(values);
        },
    });

    useEffect(() => {
        getCategoryById();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCategoryById = async () => {
        const response = await makeAPICall({
            endpoint: 'getCategoryById',
            pathParam: `/${props.catId}`
        })
        if (response.status) {
            formik.setValues({
                categoryName: response.data.categoryName,
                categoryId: response.data.categoryId,
            })

            if(response.data.categoryImage) {
                const url= API_BASE_URL+ '/' + response.data.categoryImage
                setImagePath(url)
                setCategoryImage(response.data.categoryImage)
            }
          
        } else {
            toast.error('Something went wrong, Unable to fetch the user data!')
        }
    }

    const updateCategories = async (postData) => {
        const postBody = Object.assign(postData,{categoryImage:categoryImage})
        delete postBody.categoryId;
        const response = await makeAPICall({
            endpoint: 'updateCategory',
            body: postBody,
            pathParam: `/${props.catId}`
        })
        if (response.status) {
            toast.success(response.message);
            props.onHide()
        } else {
            props.onHide()
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
                endpoint: 'categoryUploadFile',
                body: formData
            })
            if (response.status) {
                const url=API_BASE_URL+'/'+response.path
                toast.success(response.message);
                setImagePath(url)
                setCategoryImage(response.path)
               // props.onHide()
            } else {
                //props.onHide()
                toast.error(response.message);
            }
        }
    }


    return (
        <div>
            <form id="formik-form" onSubmit={formik.handleSubmit}>
                <div className="secondary-title my-3">Category Info</div>
                <div className="text-center">
                <div className="rectangle-bg py-3">
                        <input className='file-upload' id="choose_pic" onChange={(e) => uploadFile(e)} type="file" accept='image/*' />
                        <img src={imagePath} onError={(e) => e.currentTarget.src = camera} width={64} alt="user profile" />
                        <div className="image-label my-1">Select Product Image</div>
                    </div>
                </div>
                <Row className="my-4">
                    {/*<Col md={6} sm={12}>
                        <Input
                            name="categoryId"
                            id="categoryId"
                            onChange={formik.handleChange}
                            value={formik.values.categoryId}
                            isFormikSupported={true}
                            label="Category Id"
                            placeholder="Auto-Generated ID" 
                            disabled={true}
                            />
                    </Col>*/}
                    <Col md={6} sm={12}>
                        <Input
                            name="categoryName"
                            id="categoryName"
                            onChange={formik.handleChange}
                            value={formik.values.categoryName}
                            error={formik.errors.categoryName}
                            isTouched={formik.touched.categoryName}
                            isFormikSupported={true}
                            label="Category Name"
                            placeholder="Enter Category Name" />
                    </Col>
                
                </Row>


            </form>
        </div>
    )
}

export default EditCategory
