import * as Yup from 'yup';

export const couponValidationSchema = Yup.object().shape({
    couponName: Yup.string().required('Coupon name is required'),
    couponCode: Yup.string().required('Coupon code is required').min(4, 'Coupon code must contain at least 4 characters')
    .matches(/^[A-Za-z0-9#]{4,12}$/, 'Coupon code only contains alphanumeric with # and 4-12 characters'),
    couponDescription: Yup.string().required('Coupon description is required'),
    percentage:Yup.number().required('Coupon % is required').min(1, 'Coupon % should be >= 0').max(100, 'Coupon % should be <= 100'),    
});

