
# joelvt

https://joelvt.dev/

My own corner of the internet. For anything and everything, but mainly to learn.

## Stack

- Framework: next.js
- ORM: prisma
- Database:
  - postgres (neon)
  - postgres (Marko's NAS)
- Storage: S3
- Emails: nodemailer
- Auth: better auth
- Deployment: Vercel (then switch to AWS later?)
- APIs:
  - Movies: TMDb
  - Books: Google Books API
  - Banking: Up
  - Music: Spotify Web API or iTunes Search API
  - Geocoding: Nominatim
  - Notes to self: Discord
- Other bits:
  - Components: shadcn

## TODO

- https://http.cat/
- books i've read (api)
  - with a button for people to request I read a book
- auth
  - anyone can login and message (msg me or msg any user?)
  - a zone for just jess and i
    - Up API / budget / frollo
  - "The Crew" 
    - family-only login with events dashboard, family info etc
- photons 
  - add orientation to schema - landscape or portrait
  - based around a central leaflet map
  - click on the map to see photos at that place, like in google photos
  - travel photos + general photos
- later:
  - about
  - life story
  - blog
    - (mdx for blog?)
    - (Software) learning journey
    - On Music
    - Jazz
    - Music theory - my strong opinions about what to learn
    - Skateboarding
    - BMX
    - Bus driving
    - QUT / research
    - obsidian
  - music
  - 

## Commands

```sh
# get started
npx create-next-app@latest .

## install stuff
npx shadcn@latest init  # do this instead of `npm i shadcn`
npx shadcn@latest add button label input sonner  # install shadcn components
npm i better-auth
npm i prisma --save-dev
npm i @prisma/adapter-pg
npm i @prisma/client
npm i --save-dev @types/pg
npm i --save-dev @types/nodemailer
npm i @node-rs/argon2
npm i nodemailer
npm i react-tooltip

# db operations
npx prisma init
npx prisma db push  # AFTER adding a table/model
npx prisma generate  # but also this goes into scripts in package.json so it gets run whenever you `npm run dev`
prisma migrate dev?

# better auth
npx @better-auth/cli generate --output=auth.schema.prisma  # AFTER setting up db  # the output flag is to prevent our schema being overwritten; we do this instead, copy over what we need from auth.schema.prisma to schema.prisma, then delete auth.schema.prisma

# run dev server
npm run dev
```