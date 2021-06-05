### Payment Service

#### Funktionale Anforderungen

- Der Payment Service muss die Bezahlung der Produkte abwickeln
- Der Service muss den Nutzer über eine erfolgreiche Zahlung benachrichtigen
- Der Service muss die angegebenen Daten verifizieren können
- Der Service muss den Nutzer informieren, wenn die Zahlung nicht durchgeführt werden konnte

#### Nichtfunktionale Anforderungen

- Mit den Daten muss sicher umgegangen werden (Datenintegrität)
- Der Service muss zuverlässig arbeiten
- Die Korrektheit der Prozesse muss gegeben sein
- Eine gewisse Flexibilität muss gegeben sein, damit der Service um weitere Bezahlmöglichkeiten erweiterbar ist

#### User Stories

| Name                                        | In meiner Rolle als | möchte ich                                                   | ,so dass                                     | Erfüllt, wenn                                   | Priorität |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------- | --------- |
| Benachrichtigung  (fehlgeschlagene Zahlung) | Benutzer            | bei einer fehlgeschlagenen Zahlung eine Benachrichtigungen bekommen | ich die Zahlung später erneut ausführen kann | Benutzer weiß ob die Zahlung fehlgeschlagen ist | Muss      |

| Name    | In meiner Rolle als | möchte ich                          | ,so dass                                       | Erfüllt, wenn               | Priorität |
| ------- | ------------------- | ----------------------------------- | ---------------------------------------------- | --------------------------- | --------- |
| Zahlung | Benutzer            | die Zahlung erfolgreich durchführen | der Kauf erfolgreich abgeschlossen werden kann | die Zahlung erfolgreich ist | Muss      |

| Name                                    | In meiner Rolle als | möchte ich                                                   | ,so dass                       | Erfüllt, wenn                                                | Priorität |
| --------------------------------------- | ------------------- | ------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------ | --------- |
| Benachrichtigung (erfolgreiche Zahlung) | Benutzer            | darüber benachrichtigt werden wenn die Zahlung erfolgreich war | die Zahlung  abgeschlossen ist | die Zahlung erfolgt ist und eine Benachrichtigung an den Nutzer gesendet wurde | Muss      |

