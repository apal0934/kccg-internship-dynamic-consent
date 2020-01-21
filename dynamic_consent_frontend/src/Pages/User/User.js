import { Layout, PageHeader } from "antd";
import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Redirect } from "react-router-dom";
import UserHPOsConsent from "./Consents/UserHPOsConsent";
import UserOrgsConsent from "./Consents/UserOrgsConsent";
import UserPurposesConsent from "./Consents/UserPurposesConsent";
import gql from "graphql-tag";

const { Content } = Layout;
export class User extends Component {
    state = {
        data: [],
        loading: true,
        client: []
    };

    componentDidMount() {
        const cache = new InMemoryCache();
        const link = new HttpLink({
            uri: "http://192.168.220.91:8000"
        });
        const client = new ApolloClient({
            cache,
            link
        });

        client
            .query({
                query: gql`
                {
                    user(id: "${this.props.match.params.id}") {
                        id
                        firstName
                        consentOrgs {
                            id
                        }
                        consentPurposes {
                            id
                        }
                        consentHpos {
                            id
                        }
                    }
                    consentOrgs {
                        id
                        orgType
                    }
                    consentPurposes {
                        id
                        purpose
                    }
                    consentHpos {
                        id
                        hpo
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
            if (this.state.data.user) {
                this.setState({
                    loading: false
                });
            }
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

        if (!this.props.location.state) {
            return <Redirect to="/user/list" />;
        }
        if (this.state.loading) {
            return "Loading!";
        }
        return (
            <div>
                <PageHeader
                    title={`${this.props.location.state.firstName}'s Consents`}
                    breadcrumb={{ routes }}
                />
                <Content style={{ padding: "0 100px" }}>
                    <div style={{ padding: 48, minHeight: 280 }}>
                        <UserOrgsConsent
                            data={this.state.data}
                            client={this.state.client}
                        />
                        <UserPurposesConsent
                            data={this.state.data}
                            client={this.state.client}
                        />
                        <UserHPOsConsent
                            data={this.state.data}
                            client={this.state.client}
                        />
                    </div>
                </Content>
            </div>
        );
    }
}

export default User;
