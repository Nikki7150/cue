# Cue

## Description
As a high school student, I use a lot of Flashcard generator apps to make flashcards of my notes so I can study and improve my grade. It never really came to me that I could actually build a generator on my own just by using Gemini AI.
After I saw someone on the internet suggest to make an AI flashcard maker using Gemini or Claude, I immediately opened my laptop and created a github repo for this app. 
This was pretty simple to make. The only thing that was hard was getting the exact prompt to make the AI give me responses only in json without any markdown. But after several tries, I did manage to get the perfect prompt that generated the cards for me. 
Other than that, I just added all my dashboard stuff like stats, saving cards, saving decks and tags, and signing in and creating profiles. Since I had done this a lot of times before, it was easier for me to create everything from scratch. 
I also added some cool little ui elements and animations, like the lid of the deck container sliding open when hovering over it and the flip animation for the flashcard. It was really fun creating this app since it was so simple and yet a little complicated. I hope you have a great time using the app! Ciao!

## Features
- As a guest user, without logging in, you can only remain on the login page since I have out all the other pages under a protected route.
- Signup using email, username, and password.
- Login using email and password.
- Go to the Upload tab to upload either .txt or .pdf files and generate flashcards for your pasted text.
    - The AI auto-generates deck titles for you, as well as questions and answers for the flashcards.
    - When uploading, the computer shows all the text from your .txt file or the text it extracted from your pdf in the white text box, where you can edit the text as per your liking
- After the AI completes generating, it will redirect you to the review page where you can:
    -  view all your flashcards,
    -  change the question and answers for each flashcard,
    -  shuffle the cards,
    -  click on the right arrow on screen to move to the next flashcard,
    -  click on the flashcard to flip it to the other side, 
    -  click on the refresh icon on the left of the flashcard to put the current card to the back of the deck so you can learn it again,
    -  check your progress in the deck through the progress bar at the bottom of the screen
    -  click on the 'X' to go to view all your decks
- The Decks tab shows you all your decks from newest to oldest, which you can switch with the respective button
    - you can search up certain words and the computer logic reads through your deck titles and flashcard questions and answers to find the word and shows you all the decks that has that word
    - filter your deck view according to your tags
    - click on the three dots on each deck to edit deck
        - edit deck title
        - edit tag the deck belongs to
        - create new tag with a special name and color
        - delete tags
        - delete deck
    - Check your progress through the progress bar under each deck
- Your Home screen shows you a short overview of your profile, with your profile stats, the decks you are currently learning, and four decks from your list with a see all button to go to Decks tab, and the plus icon to go to the Upload tab.
- In your navbar, you can see your profile at the bottom where you can click on the arrow to see your email you logged in through, your username, and a logout button to log in with a different account or to just log out just cause. 

## Technologies used
- React
- Vite
- React Router
- Firebase Authentication
- Firebase Firestore
- Google Gemini API

## Limitations
- No Google Auth login setup
- No resume mid-deck according to progress
- One tag per deck
- No spaced-repetition for "Don't know" cards
- No deck sharing

## Future Plans
- Adding resume mid-deck according to progress saved in last session
- Multiple tags per deck
- Export deck as json file
- Add spaced repetition and tracking for cards in each deck

## How to set up locally
### Prerequisites
- Node.js 18+
- A Firebase project (free tier is enough) with Authentication (Email/Password and Google Providers) and Firestore Database enables
- A Google Gemini AI API Key (free)
- react pdftotext

### Setup
1. Clone the repo and install dependencies:
```bash
npm install
```
 
2. Copy `.env.example` to `.env` and fill in your own values:
```bash
cp .env.example .env
```
 
```
VITE_GEMINI_API_KEY=your_google_gemini_api_key
 
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
 
Firebase config values are found in your Firebase project settings under **Project settings → General → Your apps → SDK setup and configuration**.
 
3. In the Firebase console, enable **Email/Password** and **Google** under **Authentication → Sign-in method**, and create a **Firestore Database**.
4. Publish the following Firestore security rules (**Firestore Database → Rules**), which scope all reads/writes to each signed-in user's own data:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /decks/{deckId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /tags/{tagId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
 
5. Start the dev server:
```bash
npm run dev
```
 
The app will be running at `http://localhost:5173`.

## Notes
- Firestores test-mode rules expire after ~30days; the rules written above replace the test mode with rules scoped to each signed-in user's own data, so they don't expire.
- Card generation is tuned via prompt instructions in `src/lib/generateCards.js` to scale flashcard count with input length rather than producing a fixed size summary. 
