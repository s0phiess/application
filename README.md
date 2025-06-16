📱 Aplikacja Mobilna — Fit Track Pro App

🧾 Opis projektu
Aplikacja mobilna stworzona w technologii React Native z wykorzystaniem Expo. Zapewnia użytkownikowi dostęp do pulpitu nawigacyjnego (dashboard), integrację z funkcjami natywnymi urządzenia, takimi jak lokalizacja GPS , oraz umożliwia zarządzanie profilem użytkownika.

Projekt został stworzony z myślą o responsywnym interfejsie, bezpiecznym logowaniu i dobrej architekturze kodu.

Instrukcja uruchomienia

Zainstaluj zależności:
npm install
Uruchom projekt lokalnie:
npx expo start
Podgląd w Expo Go:
Zeskanuj QR kod z terminala w aplikacji Expo Go na telefonie.

Wymagania
Node.js (>= 18.x)
Expo CLI (npm install -g expo-cli)
Konto Expo (opcjonalne, ale zalecane)

Użyte technologie
1.React Native + Expo – budowa aplikacji mobilnej
2.Expo Router – nawigacja ekranowa w stylu Next.js
3.expo-location – dostęp do lokalizacji GPS
4.expo-notifications – integracja z powiadomieniami push
5.React Context API – zarządzanie tematyką UI (dark/light mode)
6.SecureStore – bezpieczne przechowywanie tokenów
7.TypeScript – typowanie kodu
8.ESLint + Prettier – jakość kodu i jego formatowanie
 
 Struktura katalogów
project/
├── app/               # Pliki routingu (np. login, signup, dashboard)
├── components/        # Komponenty wielokrotnego użytku (np. LocationButton)
├── contexts/          # Konteksty (np. ThemeContext)
├── stores/            # Obsługa danych (np. auth store)
├── assets/            # Ikony, obrazy itp.

 Funkcjonalności aplikacji:
 1.Logowanie i rejestracja z walidacją
 2.Pobieranie lokalizacji GPS
 3.Tryb jasny/ciemny
 4.Ekran profilu użytkownika
 5.Routing oparty o strukturę folderów (Expo Router)
 6.Bezpieczne przechowywanie tokenów
 7.Obsługa błędów z komunikatami
 Tryb offline (cache danych)
 Przygotowanie pod publikację (build i deployment)
