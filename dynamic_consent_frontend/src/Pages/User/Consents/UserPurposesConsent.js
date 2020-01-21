import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserPurposesConsent extends Component {
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
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            addConsentPurposes(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentPurposes {
                                    id
                                }
                            }
                        }
                    }
                `
            });
        } else {
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            revokeConsentPurposes(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentPurposes {
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
        const columns = [
            {
                title: "Purpose",
                dataIndex: "purpose",
                key: "purpose",
                render: record => {
                    switch (record) {
                        case 1:
                            return "General research and clinical use";
                        case 2:
                            return "Health/Medical/Biomedical research";
                        case 3:
                            return "Population and Ancestry research";
                        default:
                            return "Unknown";
                    }
                }
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
                    dataSource={this.props.data.consentPurposes}
                    rowKey="id"
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserPurposesConsent;
