import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserOrgsConsent extends Component {
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
                            addConsentOrgs(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentOrgs {
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
                            revokeConsentOrgs(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentOrgs {
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
                title: "Organisation Type",
                dataIndex: "orgType",
                key: "orgType",
                render: record => {
                    switch (record) {
                        case 1:
                            return "Not-for-profit research institutes";
                        case 2:
                            return "University or research institutes";
                        case 3:
                            return "Government institutes";
                        case 4:
                            return "Commercial companies";
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
                            this.props.data.user.consentOrgs
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
                    dataSource={this.props.data.consentOrgs}
                    rowKey="id"
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserOrgsConsent;
