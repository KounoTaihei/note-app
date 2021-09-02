import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import * as Yup from 'yup';

const apiUrl = process.env.API_URL + "/notes";

const CreateNote = () => {
    const router = useRouter();

    const initialValues = {
        title: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(50, '50文字以内で入力してください').required('入力必須です')
    });

    return (
        <>
            <Formik
                initialValues = {initialValues}
                validationSchema = {validationSchema}
                onSubmit = {async (values) => {
                    await axios.post(apiUrl, values);
                    router.push('/notes');
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    handleReset
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div>
                                <TextField
                                    error={errors.title && touched.title ? true : false}
                                    helperText={errors.title && touched.title ? errors.title : ""}
                                    label="タイトル"
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                            </div>
                            <span className="text-red-400">
                                {errors.title && touched.title}
                            </span>
                        </div>
                        <div className="m-2">
                            <Button variant="outlined" onClick={handleReset}>
                                Clear
                            </Button>
                            <Button variant="outlined" color="primary" type="submit" disabled={isSubmitting}>
                                Create
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default CreateNote;