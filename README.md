# Medrunner Assistant
Make your life as Medrunner easier with custom alert notifications and LEAD tools.

## Features
- Play custom sound if an alert came in
- Play custom sound if a new chat message of an alert came in (as LEAD)
- Play custom sound if a medrunner requests joining your team (as LEAD)

## Planned features:
- `AAR`: Auto fill out AAR Template with clients questionaire for copy pasta
- `Timestamps`: Make it easy to keep track of the timestamps of the alert with an easy input for LEAD
- `Activity`: Stop notification sound when user has gotten active on the computer
- `SoundControl`Volume Control for every sound
- `GUI` overlay flashy but professional informing about new alert
- `GUI` overlay displays basic alert info
- `GUI` overlay displays additional information on location e.g. temperature, oxygen, mean travel time

## Set it up yourself
`NOTICE: Currently it utilized Powershell and Windows Media Player for the sound playback. So it wont work on any other machine than Windows currently!`

1. Install NodeJS
2. Get an api token in the Medrunner Profile
3. Get your sound files in the directory, they need to be `.wav`
4. Install dependencies by `npm i`
5. Rename `.env.example` to `.env`
6. Change config in .env
   1. Add your personal token that you got in step 2
   2. Add path to your sound files example `./red_alert.wav`
   3. Enable/Disable features as you like
7. Open your console and run the script `node main.js`

## Contributors
A huge thanks to @Luebbie5000 for the support on coding this!

If you want to participate in the development you are free to open a Pull Request, open an issue for e.g. a feature request or bug reports.
You can also send me a message on discord with the handle `.generalmine`