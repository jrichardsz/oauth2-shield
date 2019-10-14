# Oauth2 Shield

A minimal, fast and ready to use oauth2 implementation.

<img src="https://raw.githubusercontent.com/jrichardsz/oauth2-shield/master/logo.png" width="30%">

# Endpoints

| Endpoint        | description  |
|:------------- |:-----|
| /oauth2/credentials      | [client id & client secret generator](https://github.com/jrichardsz/oauth2-shield/wiki/Endpoint-:-Credentials-Generation)
| /oauth2/token      | [access_token generation](https://github.com/jrichardsz/oauth2-shield/wiki/Endpoint-:-Token-Generation)
| /oauth2/introspect      | [return meta information surrounding the token](https://github.com/jrichardsz/oauth2-shield/wiki/Endpoint-:-Token-Introspect)

# Oauth2 Flow

Check this [guideline](https://github.com/jrichardsz/oauth2-shield/wiki/Oauth2-Flow)

# Prerequisites

- Linux
- Nodejs >= 8
- Mysql = 5.7.*
  - **Another version, show errors and unexpected behaviors**
  - Execute sql script : /ddl.sql

# Required variables


| Variable        | Description  |
|:------------- |:-----|
| token_secret      | alphanumeric string required to jwt token generation
| token_life      | string representation of token expiration time. Example: 10s, 50m, 1h,etc
| database_host      | mysql database host. Ip or domain
| database_user      | user to login into mysql database host.
| database_password      | password related to **database_user**.
| database_port      | mysql port. Most of the time is 3306
| database_name      | name of database.
| database_connection_management      | database connection type: single or pool. Default: single
| database_connection_pool_limit      | The maximum number of database connections to create at once. Check [this](https://www.npmjs.com/package/mysql)
| auth_realm      | alphanumeric string required to basic auth entropy.
| auth_user      | user to perform requests to **/oauth2/credentials** endpoint .
| auth_password      | password related to **auth_user**
| TZ      | Linux timezone. **IMPORTANT FOR DATES AND EXPIRATION TIME**. Example: 'America/Lima'

More details about required variables [here](https://github.com/jrichardsz/oauth2-shield/wiki/Required-Variables)

# Run for Developers

Just
```
npm install
```

Export required [variables](https://github.com/jrichardsz/oauth2-shield/wiki/Required-Variables#quickly-configuration), startup your mysql

And execute
```
npm run dev
```


# Run in Production environments

Just
```
npm install
```

Export required [variables](https://github.com/jrichardsz/oauth2-shield/wiki/Required-Variables#quickly-configuration), startup your mysql

And execute
```
npm run start
```

# Run with Docker

Check this [guideline](https://github.com/jrichardsz/oauth2-shield/wiki/Launch-with-Docker)

# Unit Testing

Check this [guideline](https://github.com/jrichardsz/oauth2-shield/wiki/Unit-Testing)

# Wiki

Check [this](https://github.com/jrichardsz/oauth2-shield/wiki)

# TO-DO

- More unit tests
- Add UI for management
- Upload to public docker hub
- Add docker-compose

# Contributors

<table>
  <tbody>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">Richard Leon</a></label>
      <br />
    </td>    
  </tbody>
</table>
