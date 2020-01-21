import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserOrgsConsent extends Component {
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
                            addConsentOrgs(userId: "${user}", consentIds: [${consent.key}]) {
                            user {
                                id
                                consentOrgs 
                            }
                        }
                    }
                `
            });
        } else {
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            revokeConsentOrgs(userId: "${user}", consentIds: [${consent.key}]) {
                            user {
                                id
                                consentOrgs
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
                orgType: "Not-for-profit institutes"
            },
            {
                key: 2,
                orgType: "University and research institutes"
            },
            {
                key: 3,
                orgType: "Government institutes"
            },
            {
                key: 4,
                orgType: "Commercial companies"
            }
        ];
        const columns = [
            {
                title: "Organisation Type",
                dataIndex: "orgType",
                key: "orgType"
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
                    dataSource={data}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserOrgsConsent;
