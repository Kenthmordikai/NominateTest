import React, { Component } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

import { useForm, useField, splitFormProps } from "react-form";

const InputField = React.forwardRef((props, ref) => {
    const [field, fieldOpts, rest] = splitFormProps(props);

    const {
        meta: { error, isTouched, isValidating, message },
        getInputProps
    } = useField(field, fieldOpts);

    return (
        <>
            <input {...getInputProps({ ref, ...rest })} />
            {isValidating ? (
                <em>Validating</em>
            ) : isTouched && error ? (
                <strong>error</strong>
            ) : message ? (
                <small>{message}</small>
            ) : null}
        </>
    );
});

const NominateForm = () => {
    const defaultValues = React.useMemo(
        () => ({
            title: "",
            keywords: ["", "", "", "", ""]
        }),
        []
    );

    const {
        Form,
        values,
        meta: { isSubmitting, isSubmitted, canSubmit, error }
    } = useForm({
        defaultValues,
        onSubmit: async (values, instance) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(values);
        }
        // debugForm: true
    });

    return (
        <Form>
            <div>
                <label>
                    Title: <InputField field="title" />
                </label>
            </div>
            <div>
                <label>Nominate</label>
                {values.keywords.map((el, i) => (
                    <div key={i}>
                        <InputField field={`keywords.${i}`} />
                    </div>
                ))}
            </div>
            {isSubmitting ? (
                "Submitting..."
            ) : (
                <div>
                    <button type="submit" disable={!canSubmit}>
                        Search
                    </button>
                    <button
                        onClick={e => {
                            console.log(values);
                            e.preventDefault();
                        }}
                    >
                        Nominate
                    </button>
                </div>
            )}
        </Form>
    );
};

function App() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Nominees</div>

                        <div className="card-body">
                            <NominateForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

if (document.getElementById("example")) {
    ReactDOM.render(<App />, document.getElementById("example"));
}
