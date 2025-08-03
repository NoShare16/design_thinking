<img width="2695" height="2990" alt="Untitled-2024-05-13-1818-light" src="https://github.com/user-attachments/assets/c13cac9e-d420-45fe-bab2-9c46901d5210" />


# Features
- bar codes scannen
  > Wird nicht im ersten Prototypen getestet, soll später primare Produkteingabe sein
- ocr produkterkennung
  > Fallback wenn Produktinformationen nicht gefunden werden können, gering priorisiert
- Genauere Produktinformationen wie die verwendetet Inhaltstoffliste anzeigen
  > nice to have feature, kern feature ist die Allegenerkennung und Warnung
- persöhnliches Profil über Allergien/Unverträglichkeiten
  > Auswahl von vordefinierten Allergenen
- warnung falls relevante allergene gefunden in liste
- datenbank mit liste an allergenen für produkte
  > Suche und test verfügbarer Datenbanken ist Prototyp 1
- score das ungefähre Verträglichkeit wiederspiegelt
  > erstmal out of scope, mögliche erweiterung für einschätzen von Allergen Dosierungen
- vorschläge für alternative produkte
  > erstmal out of scope, gute Empfehlungen müssen vermutlich auf den Verwendungszweck eingehen
- beachten von Synonymen und Fachbegriffen
  > Kandidat für späteren Prototypen, eventuell gibt es schon Datenbanken für sowas, eventuell per KI
- ernährungstagebuch, Feedback bezüglich Reaktion auf Produkte
  > erstmal out of scope, feeback bezüglich Reaktionen könnte genutzt werden um eigene Allegen Datenbank zu verbessern


# Goal Prototyp 1
- Recherchiere nach brauchbaren Datenbanken mit Allegiedaten zu den meisten Lebensmitteln und Produkten
- Prüfen von Nutzungsbedingungen und Anforderungen (Api Keys) für die Nutzung
- Erstellen eines kleinen möglichen Allergieprofils zum testen
- Ziel: Eine kleine Anwendung (zb. Http Request via Curl) die einen Barcode annimmt, und die eine Liste an Inhaltstoffen zurückgibt
