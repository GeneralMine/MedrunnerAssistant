# Medrunner Assistant
Make your life as Medrunner easier with custom alert notifications and LEAD tools.

## Features
- `Alert`: Custom sound for incoming alerts
- `Chat`: Custom sound for client chat messages
- `Team`: Custom sound for team join requests

## Planned features:
- `AAR`: Autofill AAR Template based on clients questionaire from the chat
- `Timestamps`: Track Timestamps for LEAD
- `Activity`: Detect if user is active (or fallen asleep)
- `Sounds`: Volume Control for all sounds and OS
- `GUI`: Enable/Disable sounds and select volume
- `GUI`: Easy and flashy overlay informing about alert
- `GUI`: overlay displays basic alert info
  - Client Name
  - Thread Level
  - System
  - Planet Body
  - Location
- `GUI`: overlay displays additional information
  - Temperature
  - Oxygen
  - Mean travel time from musterpoint
  - Hostile/Peaceful place
  - Peaceful with missions
  - Turrets
  - Terrain to hide from turrets or not
  - Recommended ships to use
  - Landing/Dropoff/Cover sites

## Set it up yourself
1. Install [NodeJS](https://nodejs.org/en/download)
2. Get an api token in the Staff Portal Medrunner Profile
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