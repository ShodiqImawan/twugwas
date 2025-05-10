## Setting Sebelum Pakai
Pastikan kalian mengikuti langkah-langkah di bawah ini untuk mempersiapkan project sebelum melanjutkan pengembangan. Tanpa settingan ini, kalian tidak akan bisa melanjutkan development. 
Kecuali kalian memang bisa tanpa settingan ini!

## update
- Struktur folder baru
- Sistem log server (Beta)
- Sistem maintenance (Beta)
- Sistem database pool

## Noted
- Informasi database sesuaikan sendiri di file .env
- Jika ingin push, pastikan ke branch dev saja
- Beta = Masih dalam tahap pengembangan atau eksperimen

## Clone
Pakai perintah ini agar tidak ribet ketik URL atau branch secara manual
``` git clone -b dev https://github.com/ShodiqImawan/twugwas.git ```

## Package
Jalankan perintah ini untuk menginstal semua package yang dibutuhkan
``` npm install ```

## Noted for database
Jika buat user jangan pakai
```sql
CREATE USER 'nama'@'localhost' IDENTIFIED BY 'password';
```

Tapi pakailah ini, agar user bisa di akses oleh semua ip
```sql
CREATE USER 'nama'@'%' IDENTIFIED BY 'password';
```

Jangan lupa berikan semua akses ke usernya
```sql
GRANT ALL PRIVILEGES ON *.* TO 'nama'@'%' WITH GRANT OPTION;
```

```sql
FLUSH PRIVILEGES;
```

## Database mysql
```sql
 CREATE DATABASE webplayermusic; 
 ```

## Table
### Table account
```sql
CREATE TABLE account (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    type ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    PRIMARY KEY (id)
 ); 
 ```

### Table session_login
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
