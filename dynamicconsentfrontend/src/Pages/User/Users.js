import { Icon, Layout, Table } from "antd";

import { Link } from "react-router-dom";
import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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

const columns = [
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
    }
];

const Users = () => {
    const { data, loading } = useQuery(GET_USERS);

    return (
        <Content style={{ padding: "0 50px" }}>
            <div style={{ padding: 24, minHeight: 280 }}>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={data ? data.users : []}
                    rowKey="id"
                    size="small"
                />
            </div>
        </Content>
    );
};

export default Users;
