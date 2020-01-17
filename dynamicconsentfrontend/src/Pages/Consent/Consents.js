import { Icon, Layout, Table } from "antd";

import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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
        title: "Non-commercial",
        dataIndex: "commercial",
        key: "commercial",
        render: record =>
            !record ? <Icon type="check" /> : <Icon type="close" />
    }
];

const Consents = () => {
    const { data, loading } = useQuery(GET_CONSENTS);

    return (
        <Content style={{ padding: "0 50px" }}>
            <div style={{ padding: 24, minHeight: 280 }}>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={data ? data.consents : []}
                    rowKey="id"
                    size="small"
                />
            </div>
        </Content>
    );
};

export default Consents;
