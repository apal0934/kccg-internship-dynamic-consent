import "./UserPurposesConsent.css";

import { AutoComplete, Switch, Table } from "antd";
import React, { Component } from "react";

import gql from "graphql-tag";

const AutoCompleteOption = AutoComplete.Option;

export class UserPurposesConsent extends Component {
    state = {
        autocompleteData: [],
        expanded: false
    };

    search(query) {
        let url = `https://api.monarchinitiative.org/api/search/entity/autocomplete/${query}?category=phenotype&prefix=HP&rows=5&start=0&minimal_tokenizer=false`;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onload = () => {
            let status = xhr.status;
            if (status === 200) {
                this.setState({
                    autocompleteData: xhr.response.docs
                });
            }
        };
        xhr.send();
    }

    onSearch = query => {
        if (query.length >= 3 && query.length % 2 === 0) this.search(query);
    };

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
            if (consent.key === "DUO:0000007") {
                this.setState({
                    expanded: true
                });
            }
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
            if (consent.key === "DUO:0000007") {
                this.setState({
                    expanded: false
                });
            }
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

    onSelect(user, consent) {
        console.log(user);
        console.log(consent);
        this.props.client.mutate({
            mutation: gql`
                mutation addHPO($userId: String!, $consentIds: [String]) {
                    addConsentHpos(userId: $userId, consentIds: $consentIds) {
                        user {
                            id
                            consentHpos
                        }
                    }
                }
            `,
            variables: {
                userId: user,
                consentIds: [consent]
            }
        });
    }

    render() {
        const autcompleteData = this.state.autocompleteData.map(hp => (
            <AutoCompleteOption key={hp.id}>{hp.label}</AutoCompleteOption>
        ));

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
                purpose:
                    "Research must be specifically related to my condition",
                expand: true
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
                    rowClassName={record => "hide-expand"}
                    expandedRowRender={record => (
                        <AutoComplete
                            dataSource={autcompleteData}
                            onSearch={this.onSearch}
                            placeholder={"Search for condition"}
                            onSelect={e =>
                                this.onSelect(this.props.data.user.id, e)
                            }
                        />
                    )}
                    expandedRowKeys={this.state.expanded ? ["DUO:0000007"] : ""}
                />
            </div>
        );
    }
}

export default UserPurposesConsent;
