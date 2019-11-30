# data-hub-access

REST API for accessing harmonized documents in MarkLogic Data Hub.

## Requirements

- Node.js v8.14.0+
- npm v6.4.1+
- MarkLogic Data Hub 5

## Setup

Install [MarkLogic Data Hub](https://github.com/marklogic/marklogic-data-hub) and harmonize some data.

For example, run some flows from the [insurance example](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/insurance) ingest and map customer data. This will create harmonized customer documents in your data hub.

Install this project:

```
git clone https://github.com/wooldridge/data-hub-access
cd data-hub-geo
npm install
```

In a text editor, open `config_sample.js` and edit the settings (e.g., username and password for your Data Hub). Save the file as `config.js`.

## Start the Application

From the project root in a terminal window:

`npm start`

## Access the API in a Web Browser

http://localhost:3000/search

The API returns the harmonized documents.
