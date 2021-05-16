# MicroShop 
### Cloud-Software-Engineer
- Michael Nickel
- Benedikt Wiest
- David Nickel
- Marc Schwettmann
- Lennart Dümke
- Yannic Döll

### DevOps-Engineer
- Domenic Drechsel

### Scrum-Master
- Lukas Walter

## Organisationseinheiten eines Onlineshops

- Payment (Michael Nickel)
- Logistik (Benedikt Wiest)
- Package Tracking (Benedikt Wiest)
- Usermanagement / Account Service (David Nickel)
- Catalog Service (Marc Schwettmann)
- Cart Service (Lennart Dümke)
- Order Service (Yannic Döll)
- API Gateway (Domenic Drechsel)

## Architektur Pattern
https://microservices.io/patterns/microservices.html

## Beispiel
https://dzone.com/articles/microservices-online-shop


# Kurzdarstellung der Projektidee

Im Zuge des Moduls „Spezielle Gebiete zum Software Engineering“ wird ein Online-Shop mit dem Namen MicroShop realisiert. MicroShop ist ein Verkäufer von Tontechnik für Endanwender. Zu dem Sortiment gehören unter anderem Mikrofone, Lautsprecher, Kopfhörer und Headsets. Der Online-Shop zielt auf junge, gamingaffine Menschen im Alter zwischen 13 und 30 Jahren ab. Durch das breite Produktspektrum richtet sich MicroShop sowohl an Einsteiger als auch an erfahrene Kunden.

Die Ziele dieses Projekts teilen sich dabei in zwei Gruppen auf: die Sicht des Kunden sowie die technische Sicht. Der Online-Shop soll für den Kunden optisch ansprechend sein und eine hohe Usability aufweisen. Durch ein gutes und verständliches Design soll sich der Online-Shop von der Konkurrenz abheben. Optimierte Ladezeiten sollen dazu führen, Kunden ein gutes Shoppingerlebnis zu garantieren. Der Bezahlvorgang soll durch verschiedene Zahlungsdienstleister ermöglicht werden, um dem Kunden größtmögliche Freiheit zu gewähren. Auch der Versand der Waren soll durch verschiede Versanddienstleister ermöglicht werden. 

Durch die Modularisierung und die Aufteilung der Systemkomponenten in Microservices soll garantiert werden, dass bei Aktualisierung eines Service keine anderen Services betroffen sind. Dieses Konzept der niedrigen Kopplung und hohen Kohäsion soll dazu führen, den geschriebenen Code wartbarer und schlanker zu machen. Die Skalierbarkeit des Service muss in allen Bereichen gegeben sein, um mit einer steigenden Anzahl an Nutzern die Performance des Systems beizubehalten. 

Es gibt etliche Online-Shops, deren Usability nicht nur sehr niedrig ist, sondern die auch langsam und optisch nicht ansprechend sind. MicroShop soll diese Defizite nicht aufweisen und Kunden ein gutes Gefühl während des Einkaufens geben. Im Kontext der Digitalisierung ergeben sich häufige Wechsel der Anforderungen an ein System. Um die bestmögliche User Experience zu garantieren, muss es möglich sein, einzelne Module schnell zu tauschen, um immer auf dem neusten Stand der Technik zu sein. Durch die Möglichkeit der ständigen Verbesserung und der damit einhergehenden guten Nutzbarkeit, kann MicroShop überzeugen und sich von anderen Online-Shops unterscheiden. MicroShop versteht sich selbst als Prototyp und ist weder ein Forum noch ein Marketplace.
