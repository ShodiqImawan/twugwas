# Setting Database Sebelum Dipakai #
Tanpa settingan ini, kalian tidak akan bisa memakai nya atau melanjutkan development!

Noted: Untuk usernya bisa kalian sesuaikan yaa

## Database ##
``` CREATE DATABASE webplayermusic; ```

## Table ##
- Table account
``` sql
CREATE TABLE account (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    type ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    PRIMARY KEY (id)
 ); 
 ```

- Table session_login
```sql
CREATE TABLE session_login (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    session_token VARCHAR(128) NOT NULL,
    expiry_time BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(id)
);
```
