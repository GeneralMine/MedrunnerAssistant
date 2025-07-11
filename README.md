# Medrunner Assistant
A small script to customize your own alert notification sounds

1. Install NodeJS
2. Get an api token in the Medrunner Profile
3. Get your sound files in the directory, they need to be `.wav`
4. Install dependencies by `npm i -r requirements.txt`
5. Rename `.env.example` to `.env`
6. Change config in .env
   1. Add your personal token
   2. Add path to your sound files example `./red_alert.wav`
   3. Enable/Disable features as you like
7. Open your console and run the script `node main.js`