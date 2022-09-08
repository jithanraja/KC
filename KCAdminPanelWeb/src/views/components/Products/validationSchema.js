import * as Yup from 'yup';

export const productValidationSchema = Yup.object().shape({
    productName: Yup.string().required('Product Name is required'),
    categoryId: Yup.string().required('Category Name is required'),
    buyingPrice: Yup.number().required('Buying Price is required').min(1, 'Buying price should be > 0'),
    displayPrice: Yup.number().required('Display Price is required').min(1, 'Display price should be > 0'),
    maxDiscount: Yup.number().required('Max discount is required').min(1, 'Max discount should be > 0'),
    unitType: Yup.string().required('Unit type is required'),
    slabs: Yup.array().of(
        Yup.object().shape({
            from:Yup.number().required('From is required').min(0, 'From should be >= 0'),
            to:Yup.number().required('To is required').moreThan(Yup.ref('from'), "To should be > From"),
            unitPrice:Yup.number().required('Unit price is required'),
        })
    )
});

