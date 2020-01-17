import { Button, Checkbox, Form, Icon, Input, Layout } from "antd";
import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const { Content } = Layout;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddConsent extends Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        const cache = new InMemoryCache();
        const link = new HttpLink({
            uri: "http://localhost:8000"
        });
        const client = new ApolloClient({
            cache,
            link
        });

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const ADD_CONSENT = gql`
                mutation {
                    createConsent(name: "${values.name}", purpose: "${values.purpose}", commercial: ${values.commercial}) {
                        consent {
                            id
                            name
                            purpose
                            commercial
                        }
                    }
                }
                `;
                client
                    .mutate({
                        mutation: ADD_CONSENT
                    })
                    .then(result => {
                        if (!result.error) {
                            this.props.form.resetFields();
                        }
                    });
            }
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched
        } = this.props.form;

        const nameError = isFieldTouched("name") && getFieldError("name");
        const purposeError =
            isFieldTouched("purpose") && getFieldError("purpose");
        const commercialError =
            isFieldTouched("commercial") && getFieldError("commercial");
        return (
            <Content style={{ padding: "0 50px" }}>
                <div style={{ padding: 24, minHeight: 280 }}>
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <Form.Item
                            validateStatus={nameError ? "error" : ""}
                            help={nameError || ""}
                            label="Name"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("name", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Name is required"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="idcard" />}
                                    placeholder="Name"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={purposeError ? "error" : ""}
                            help={purposeError || ""}
                            label="Purpose"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("purpose", {
                                initialValue: ""
                            })(
                                <Input
                                    prefix={<Icon type="audit" />}
                                    placeholder="Purpose"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={commercialError ? "error" : ""}
                            help={commercialError || ""}
                            label="Commercial"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {getFieldDecorator("commercial", {
                                initialValue: false
                            })(<Checkbox />)}
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                Add consent
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        );
    }
}

const AddConsentForm = Form.create({ name: "add_consent" })(AddConsent);
export default AddConsentForm;
