import { Button, Icon, Layout, Table } from "antd";
import React, { Component } from "react";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

const { Content } = Layout;

const GET_USERS = gql`
    query {
        users {
            id
            firstName
            lastName
            email
        }
    }
`;

export class Users extends Component {
    state = {
        data: [],
        client: [],
        loading: true
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
                query: GET_USERS
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
            if (this.state.data.users) {
                this.setState({
                    loading: false
                });
            }
        }
    }

    delete(e, record) {
        e.preventDefault();
        const users = this.state.data.users.filter(
            user => user.id !== record.id
        );
        const data = { users };
        this.setState({
            data: data
        });
        const DELETE_USER = gql`
        mutation {
            deleteUser(id: "${record.id}") {
                user {
                    firstName
                    lastName
                    email
                }
            }
        }`;
        this.state.client.mutate({ mutation: DELETE_USER });
    }

    columns = [
        {
            title: "Name",

            key: "firstName",
            render: record => (
                <span>
                    {record.firstName} {record.lastName}
                </span>
            )
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "",
            key: "action",
            render: (text, record) => (
                <span>
                    <Link
                        to={{
                            pathname: `/user/${record.id}`,
                            state: {
                                firstName: record.firstName
                            }
                        }}
                    >
                        <Icon type="control" style={{ fontSize: 24 }} />
                    </Link>
                </span>
            )
        },
        {
            title: "",
            key: "action2",
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
                            !this.state.loading ? this.state.data.users : []
                        }
                        rowKey="id"
                        size="small"
                    />
                </div>
            </Content>
        );
    }
}

export default Users;
