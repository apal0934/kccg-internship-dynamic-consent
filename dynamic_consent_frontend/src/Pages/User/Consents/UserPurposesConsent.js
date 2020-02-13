import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserPurposesConsent extends Component {
    checkConsents(consent, user_consents) {
        let equal = false;
        user_consents.forEach(user_consent => {
            if (user_consent === consent.key) {
                equal = true;
            }
        });

        return equal;
    }

    onChange(user, consent, checked) {
        if (checked) {
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            addConsentPurposes(userId: "${user}", consentIds: ["${consent.key}"]) {
                            user {
                                id
                                consentPurposes
                            }
                        }
                    }
                `
            });
        } else {
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            revokeConsentPurposes(userId: "${user}", consentIds: ["${consent.key}"]) {
                            user {
                                id
                                consentPurposes
                            }
                        }
                    }
                `
            });
        }
    }

    render() {
        const data = [
            { key: "DUO:0000042", purpose: "General research use" },
            {
                key: "DUO:0000005",
                purpose: "General research use and clinical care"
            },
            {
                key: "DUO:0000006",
                purpose: "Health/Medical/Biomedical research"
            },
            {
                key: "DUO:0000007",
                purpose: "Research must be specifically related to my condition"
            },
            {
                key: "DUO:0000011",
                purpose: "Population and Ancestery research"
            }
        ];

        const columns = [
            {
                title: "Purpose",
                dataIndex: "purpose",
                key: "purpose"
            },
            {
                title: "Consent",
                key: "action",
                render: record => (
                    <Switch
                        defaultChecked={this.checkConsents(
                            record,
                            this.props.data.user.consentPurposes
                        )}
                        onChange={e =>
                            this.onChange(this.props.data.user.id, record, e)
                        }
                    />
                )
            }
        ];
        return (
            <div style={{ padding: 24 }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserPurposesConsent;
