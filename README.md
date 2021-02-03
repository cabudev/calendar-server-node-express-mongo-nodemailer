#Calendar APP Server

```
Server realizado con Node JS - Express - MongoDB
```

```
Validación de los datos recibidos del frontend mediante Express Validator
```

```
Base de datos MongoDB con Atlas y Mongoose
https://www.mongodb.com/cloud/atlas
https://mongoosejs.com/
```

```
Contraseña encriptada con Bcrypt 
```

```
Autenticación pasiva con JSON Web Tokens
https://jwt.io/
```

```
Restricciones de peticiones a la API con CORS
https://enable-cors.org/
https://www.npmjs.com/package/cors
```

```
Recuperar contraseña a traves de email con Nodemailer y plantilla con Pug.
Yo utilice Mailtrap para hacer las pruebas
https://www.npmjs.com/package/nodemailer
https://mailtrap.io/signin

```

```
Para hacer funcionar la app en la raiz debeis crear un fichero .env y rellenar 
las siguientes variables de entorno:

PORT=puerto en el que corre el server de express
DB_CNN=url de la base de datos de mongo yo utilice Atlas
SECRET_JWT_SEED=Clave para firmar los JWT
URL_CLIENT=URL a de la cual CORS acceptara las peticiones a la API (URL frontend)

MAILTRAP_USER=
MAILTRAP_PASS=
MAILTRAP_HOST=
MAILTRAP_PORT=
```

```
Cualquier consulta no duden en escribirme:
Catalín Budai
budaimc@gmail.com
```