import React, { Component } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import gql from "graphql-tag";

import LoadingScreen from "react-loading-screen";
import { PageHeader, Table, Icon, Switch } from "antd";

export class User extends Component {
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
        const data = 2;
        const loading = true;
        client
            .query({
                query: gql`
             {
                user(id: "${this.props.match.params.id}") {
                    id
                    firstName
                    consents {
                        id
                    }
                }
                consents {
                    id
                    name
                    purpose
                    commercial
                }
             }`
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
            console.log(this.state.data);
            if (this.state.data.user) {
                this.setState({
                    loading: false
                });
                console.log("aa");
            }
        }
    }

    checkConsents(consent, user_consents) {
        let equal = false;
        user_consents.forEach(user_consent => {
            if (user_consent.id.localeCompare(consent.id) === 0) {
                equal = true;
            }
        });

        return equal;
    }

    onChange(user, consent, checked) {
        if (checked) {
            this.state.client.mutate({
                mutation: gql`
                        mutation {
                            addConsents(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consents {
                                    id
                                }
                            }
                        }
                    }
                `
            });
        } else {
            this.state.client.mutate({
                mutation: gql`
                        mutation {
                            revokeConsents(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consents {
                                    id
                                }
                            }
                        }
                    }
                `
            });
        }
    }

    render() {
        const routes = [
            {
                path: "/",
                breadcrumbName: "Home"
            },
            {
                path: "users",
                breadcrumbName: "Users"
            },
            {
                breadcrumbName: "You!"
            }
        ];

        const columns = [
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
                title: "Commercial",
                dataIndex: "commercial",
                key: "commercial",
                render: record =>
                    record ? <Icon type="check" /> : <Icon type="close" />
            },
            {
                title: "",
                key: "action",
                render: record => (
                    <Switch
                        defaultChecked={this.checkConsents(
                            record,
                            this.state.data.user.consents
                        )}
                        onChange={e =>
                            this.onChange(this.state.data.user.id, record, e)
                        }
                    />
                )
            }
        ];
        return (
            <div>
                <PageHeader
                    title={`${this.props.location.state.firstName}'s Consents`}
                    breadcrumb={{ routes }}
                />
                <Table
                    columns={columns}
                    loading={this.state.loading}
                    dataSource={
                        !this.state.loading ? this.state.data.consents : []
                    }
                    rowKey="id"
                />
            </div>
        );
    }
}

export default User;
