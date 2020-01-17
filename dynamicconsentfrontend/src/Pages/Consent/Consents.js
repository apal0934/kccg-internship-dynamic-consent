import { Button, Icon, Layout, Table } from "antd";
import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const { Content } = Layout;

const GET_CONSENTS = gql`
    query {
        consents {
            id
            name
            purpose
            commercial
        }
    }
`;

export class Consents extends Component {
    state = {
        data: [],
        loading: true,
        client: []
    };

    componentDidMount() {
        const cache = new InMemoryCache();
        const link = new HttpLink({
            uri: "http://localhost:8000"
        });
        const client = new ApolloClient({
            cache,
            link
        });

        client
            .query({
                query: GET_CONSENTS
            })
            .then(result =>
                this.setState({
                    data: result.data,
                    client: client
                })
            );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state !== prevState && this.state.loading) {
            if (this.state.data.consents) {
                this.setState({
                    loading: false
                });
            }
        }
    }

    delete(e, record) {
        e.preventDefault();
        const consents = this.state.data.consents.filter(
            consent => consent.id !== record.id
        );
        const data = { consents };
        this.setState({
            data: data
        });
        const DELETE_CONSENT = gql`
        mutation {
            deleteConsent(id: "${record.id}") {
                consent {
                    name
                    purpose
                    commercial
                }
            }
        }`;
        this.state.client.mutate({
            mutation: DELETE_CONSENT
        });
    }

    columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Purpose",
            dataIndex: "purpose",
            key: "purpose"
        },
        {
            title: "Non-commercial",
            dataIndex: "commercial",
            key: "commercial",
            render: record =>
                !record ? <Icon type="check" /> : <Icon type="close" />
        },
        {
            title: "",
            key: "action",
            render: record => (
                <Button
                    ghost
                    icon="delete"
                    type="danger"
                    shape="round"
                    size="small"
                    onClick={e => this.delete(e, record)}
                />
            )
        }
    ];

    render() {
        return (
            <Content style={{ padding: "0 50px" }}>
                <div style={{ padding: 24, minHeight: 280 }}>
                    <Table
                        columns={this.columns}
                        loading={this.state.loading}
                        dataSource={
                            !this.state.loading ? this.state.data.consents : []
                        }
                        rowKey="id"
                        size="small"
                    />
                </div>
            </Content>
        );
    }
}

export default Consents;
