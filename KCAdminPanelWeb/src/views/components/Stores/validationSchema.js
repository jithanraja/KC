import * as Yup from 'yup';

export const storeValidationSchema = Yup.object().shape({
    storeName: Yup.string().required('Store Name is required'),
    representative: Yup.string().required('Representative name is required'),
    contactNo: Yup.string().matches(/^\d{10}$/, 'Contact Number must contain 10 numbers').required('Contact Number is required'),
    emailId: Yup.string().email('Provide a valid email address').required('Email ID is required'),
    password: Yup.string().required('Password is required')
        .min(8, 'Password must contain 8 characters')
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/, 'Password must contain one uppercase, lowercase, special character(#?!@$%^&*-) and number'),
    altContactNo: Yup.string().matches(/^\d{10}$/, 'Alternate Contact Number must contain 10 numbers').required('Alternate Contact Number is required'),
    address: Yup.object().shape({
        doorNo: Yup.string().required('Door number is required'),
        street: Yup.string().required('Street is required'),
        locality: Yup.string().required('Locality is required'),
        area: Yup.string().required('Area is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
        pincode: Yup.string().matches(/^(\d{4}|\d{6})$/, 'Pincode must contain 4 or 6 numbers').required('Pincode is required'),
        location: Yup.string().required('Location is required')
    })
});