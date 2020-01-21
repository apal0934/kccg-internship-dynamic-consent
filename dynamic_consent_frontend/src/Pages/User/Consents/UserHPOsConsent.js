import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserHPOsConsent extends Component {
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
                            addConsentHpos(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentHpos {
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
                            revokeConsentHpos(userId: "${user}", consentIds: ["${consent.id}"]) {
                            user {
                                id
                                consentHpos {
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
                title: "For...",
                dataIndex: "hpo",
                key: "hpo",
                render: record => {
                    switch (record) {
                        case 1:
                            return "Blood";
                        case 2:
                            return "Cancer";
                        case 3:
                            return "Rare diseases";
                        case 4:
                            return "Deformities";
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
                            this.props.data.user.consentHpos
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
                    dataSource={this.props.data.consentHpos}
                    rowKey="id"
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserHPOsConsent;
