import React from "react";
import { Dialog, DialogActions, DialogContent, Slide } from '@material-ui/core'
import { Close } from "@material-ui/icons";
import { CancelButton, SubmitButton } from ".";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});
export function FormModel(props) {
    return (
        <Dialog open={props.show} onClose={props.onHide} TransitionComponent={Transition} maxWidth={'md'}>
            <div className="d-flex justify-content-between align-items-center border-bottom py-4 px-3">
                <div className="primary-title text-capitalize">{props.title || 'Model'}</div>
                <button onClick={props.onHide} className="closeButton">
                    <Close/>
                </button>
            </div>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions className="border-top py-3">
                <CancelButton onClick={props.onHide}>
                    CANCEL
                </CancelButton>
                <SubmitButton form="formik-form" type="submit">
                    {props.submitButtonText || 'CREATE'}
                </SubmitButton>
            </DialogActions>
        </Dialog>
    );
}