import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import List from "react-list-select";

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
    const [publishedTitles, setPublished] = useState([]);
    const [searchResult, setResult] = useState([]);

    useEffect(() => {
        const fetchedData = async () => {
            const result = await axios("http://127.0.0.1:8000/published");

            setPublished(result.data.published_works.map(el => el.title));
        };

        fetchedData();
    }, []);

    const defaultValues = React.useMemo(
        () => ({
            title: "",
            keywords: ""
        }),
        []
    );

    const {
        Form,
        values,
        setFieldValue,
        meta: { isSubmitting, isSubmitted, canSubmit, error }
    } = useForm({
        defaultValues,
        onSubmit: async (values, instance) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            axios
                .post("http://127.0.0.1:8000/nominate", values)
                .then(result => {
                    console.log(result.data);
                });
        }
        // debugForm: true
    });

    return (
        <Form>
            <div>
                <List
                    className="settings__list"
                    items={publishedTitles.length ? publishedTitles : []}
                    onChange={key => {
                        setFieldValue("title", publishedTitles[key]);
                    }}
                />
            </div>
            <div>
                <label>
                    Title: <InputField field="title" />
                </label>
            </div>
            {values.title != "" ? (
                <div>
                    <label>Search Keywords</label>
                    <InputField
                        field="keywords"
                        onChange={e => {
                            axios
                                .post("http://127.0.0.1:8000/search", {
                                    keywords: e.target.value
                                })
                                .then(result => {
                                    console.log(result.data);
                                    setResult(result.data.map(el => el.title));
                                });
                        }}
                    />
                    <div>
                        {isSubmitting ? (
                            "Submitting..."
                        ) : (
                            <button>Nominate</button>
                        )}
                    </div>
                </div>
            ) : (
                ""
            )}
            <div>
                <label>Search Result</label>
                <List className="settings__list" items={searchResult} />
            </div>
        </Form>
    );
};

function App() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Published Works</div>
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
