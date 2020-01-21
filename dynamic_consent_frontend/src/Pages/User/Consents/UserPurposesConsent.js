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
                            addConsentPurposes(userId: "${user}", consentIds: [${consent.key}]) {
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
                            revokeConsentPurposes(userId: "${user}", consentIds: [${consent.key}]) {
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
            {
                key: 1,
                purpose: "General research and clinical use"
            },
            {
                key: 2,
                purpose: "Health/Medical/Biomedical research"
            },
            {
                key: 3,
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
