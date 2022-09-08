import * as Yup from 'yup';

export const categoryValidationSchema = Yup.object().shape({
    categoryName: Yup.string().required('Category Name is required'),
});