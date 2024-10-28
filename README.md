# Instrucciones  para la instalacion

1. Ubicarse en la carpeta donde quiere iniciar el proyecto en la consola
2. Ejecutar el comando git clone https://github.com/jhon0210/testBackend.git
3. ubicarse en la consola en la carpeta del proycto que acaba de extraer del repositorio
4. ejecutar el comando npm install -- esto es para ejecutar todas las dependencias del archivo package.json
5. abrir el archivo .env y reemplazar la palabra "id_cliente" por el id cliente que genera a la hora del registro en Amadeus
   luego reemplazar la palabra "client_secret" por el secret que genera a la hora del registro en Amadeus
   luego reemplazar la palabra "puerto_local" por el numero de puerto local que tiene en el equipo.
7. Ejecutar el comando npm start
8. consumir la api http://localhost:3000/api/hotels?hotelIds=MCLONGHM&adults=2&checkInDate=2024-11-15&checkOutDate=2024-11-20&roomQuantity=1
   con el metodo get en postman o en visual studio code con la extension Thuder Cliente o la de su preferencia.
9. para ejecutar el entorno de pruebas ejecutar el comando npm run test

    # Nota

   Al consumir la api anteriormente mencionada se ejecuta el con controlador que invoca la funcion que consume la api https://test.api.amadeus.com/v1/security/oauth2/token
   la cual a su vez genera el token y luego se consume la api https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomQuantity=${roomQuantity}&paymentPolicy=NONE&bestRateOnly=true
   la que asu vez extrae la data a mostrar para el usuario.
