import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    username: Yup.string().email('Provide a valid email address').required('Username is required'),
    password: Yup.string().required('Password is required')
        .min(8, 'Password must contain 8 characters')
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/, 'Password must contain one uppercase, lowercase, special character(#?!@$%^&*-) and number'),
    role: Yup.string().required('Role is required').oneOf(['superadmin', 'storeadmin', 'productadmin', 'user', 'admin'], 'Role must be either Admin or User'),
    mobileNo: Yup.string().matches(/^\d{10}$/, 'Mobile Number must contain 10 numbers').required('Mobile Number is required'),
    altMobileNo: Yup.string().matches(/^\d{10}$/, 'Alternate Contact Number must contain 10 numbers')
});