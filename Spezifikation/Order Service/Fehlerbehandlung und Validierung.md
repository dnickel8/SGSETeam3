### Fehlerbehandlung
- /placeOrder/
	- 406 Data not acceptable
	- 500: Could not handle query
- /getOrders/{userId}
	- 404: User not found
	- 500: Could not handle query
- /getOrder/{userId}/{orderId}
	- 404: Order not found
	- 500: Could not handle query

### Validierung
- Datenmodell
	- Überprüfung, ob alle wichtigen Felder eines Objekts vorhanden sind

- User Interface
	- Überprüfung, ob valide Adressinformationen eingegeben wurden
	- Überprüfung, ob Versandart ausgewählt wurde
	- Überprüfung, ob Produkte in der Bestellung vorhanden sind

- API
	- Überprüfung, ob bei Anfragen alle Informationen korrekt übergeben wurden

