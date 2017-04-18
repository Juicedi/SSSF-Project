# SSSF-Project - Cloud Memo

## Synopsis

Cloud Memo is a collaborative text sharing/editing application. Cloud Memo allows users to write a text document that can be edited and commented by file owner authorized users.

## Installation

After cloning project you have to get the node modules.
```
npm install
```
You will also need to add a .env-file which should consist database connection information.
```
DB=XXXXXXXX
DB_HOST=XXXXXXXX
DB_USER=XXXXXXXX
DB_PASS=XXXXXXXX
DB_PORT=XXXXXXXX
AP_PORT=XXXXXXXX
```
* DB = Database name
* DB_HOST = Database hostname
* DB_USER = Database username
* DB_PASS = Database password
* DB_PORT = Database connection port
* AP_PORT = Application localhost port

You should also have a mongoDB where user login and projects can be saved.

## License

MIT