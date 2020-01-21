# Dynamic Consent

A very basic prototype of a Dynamic Consent app developed as part of an internship at the Garvin Institute of Medical Research (KCCG).

This is restricted to an extremely limited scope as only one component of a larger working demo for The GeneTrustee system.

## Scope

-   Create users
-   Delete users
-   Update a user's consent for:
    -   Organisational type
    -   Purpose
    -   HPOs (not actual HPOs, for demo purposes)

Anything else (user authentication, validation etc) is out of scope for demonstrating functionality.

Strictly speaking, the frontend is out of scope too. But it was fun to make :)

## Setup

This project was written mostly using WSL 2. It assumes the LAN IP address to be that of my WSL 2 system for requests and networking in general, and those have been hardcoded as - at the moment - it's only intended to run on my machine. You can change this through the `API_IP` variable in `App.js`

For setup instructions, refer to the readmes in the two folders for the front- and backend.
