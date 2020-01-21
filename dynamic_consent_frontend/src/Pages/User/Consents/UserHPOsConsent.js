import React, { Component } from "react";
import { Switch, Table } from "antd";

import gql from "graphql-tag";

export class UserHPOsConsent extends Component {
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
                            addConsentHpos(userId: "${user}", consentIds: [${consent.key}]) {
                            user {
                                id
                                consentHpos
                            }
                        }
                    }
                `
            });
        } else {
            this.props.client.mutate({
                mutation: gql`
                        mutation {
                            revokeConsentHpos(userId: "${user}", consentIds: [${consent.key}]) {
                            user {
                                id
                                consentHpos 
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
                hpo: "Cancer"
            },
            {
                key: 2,
                hpo: "Blood"
            },
            {
                key: 3,
                hpo: "Rare diseases"
            },
            {
                key: 4,
                hpo: "Deformities"
            }
        ];

        const columns = [
            {
                title: "For...",
                dataIndex: "hpo",
                key: "hpo"
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
                    dataSource={data}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

export default UserHPOsConsent;
