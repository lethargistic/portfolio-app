- [ ] fix if bork: make the language changer reload the page again if it gets janky
- [ ] todo: responsive
- [ ] todo pain: no time right now but more art, like i want hollow knight type decor things (yes im crazy)
- [x] todo: outline a shinkansen because art suffering
- [ ] todo: particles and actual decor for about section
- [x] cfg: lang all
- [ ] todo maybe: status effect and mana changes based on time of day
- [ ] todo maybe: maybe make status scale in
- [ ] todo maybe: ambient sounds
- [ ] todo maybe: afterfx background for s2, trains passing by into portals or something
- [ ] todo maybe: maybe let the user catch the train
- [ ] todo maybe: clicks for sounds?
- [ ] todo maybe: train pushes mouse?
- [ ] todo: DO NOT OVERDO IT ; help
- [ ] todo: take your time
- [ ] fix: train and track artstyle inconsistency
- [ ] todo fun pain: make the two branches separate in space (and not cover up the tree)
- [ ] todo very fun: make one of the blurred hangies cover up a part of the tree because the colors just look too good
- [ ] todo very: make the tree hangie section have #link-tree so i can link it, cause it's a literal link tree get it? (
  help)
- [ ] todo high: amethyst sounds
- [x] todo high: everything must have a little pencil near it so i can change whatever i want if im logged in
- [ ] todo maybe: rain on the stats page?
- [ ] todo maybe: leaf particles
- [ ] todo maybe: memorize the stat values in the db in case the enemy api dies ; enemy??? sure caffeine hallucinations
- [ ] todo maybe: multiple things hanging off the base of the hangie
- [ ] todo maybe: make client ask for social values if fail (kinda whatever since there are definitely not 5000 people
  per hour visiting my lil site)
- [x] fix very: random scroll snap in about???
- [x] todo maybe: flip icon color on selection in chimes ; dont select them you weirdo, no selection color for you
- [ ] todo maybe: occasionally stronger wind
- [ ] todo high: db backups cron (supabase provides storage, how nice of it)
- [ ] todo high: you have unposted changes!
- [ ] todo high: implement all the settings
- [ ] todo high: sounds off toast due to chrome policy if you relog
- [x] todo: replace moon thing with a less intrusive version of illusion (accessibility option should not provide new
  content)
- [x] todo high: svg sprite sheet for icons, there's way too many
- [ ] todo maybe: replace title with a proper tooltip in folds
- [ ] todo maybe: add more to hackatime section
- [ ] todo maybe: condense socials a bit, instead of 5 chimes for music 1 is enough and etc.
- [ ] todo high: extended linktree lags way too much ; nah not really
- [ ] todo maybe: about waterfall extends into scrollwork and it artsy and all
- [ ] todo maybe: cta at the end?
- [ ] todo maybe: make web dev sec change color to redder as you go? or will that not signal creativity hmm ; roses?
- [ ] todo maybe: in the blank space between web dev sec and linktree some kinda sick 3js animation saying MY WORK
- [ ] todo maybe: art art art art lots of art in web dev sec
- [ ] todo very high: add one or another kind of bg/diffuser to web dev sec
- [ ] todo maybe: investigate dev browser having slower animations
- [ ] todo: case study cursor
- [x] todo: hackery text animation ; mmm hackery that's like witchery
- [ ] todo: loading states for imgs
- [ ] todo maybe: more anims for web seg, the button for example
- [ ] todo maybe: web seg sites unfold into photo reel rather than just one pic
- [ ] todo: language rack somewhere
- [ ] fix minor: train sound doesn't play if you're unlucky enough to get it consecutively ; plus second sound might be a bit off
- [ ] fix eventually: fix mobile linktree
- [ ] fix eventually: fix web seg shadows being weird on a real phone ; it's the dynamic elems but i can't figure out
  how exactly
- [ ] fix eventually: rewrite the web seg projects in japanese with more detail when my jp is better
- [ ] fix eventually: improve linktree performance
- [ ] fix eventually: minor layout shift due to anim expanding if you scroll into web seg too fast (particularly on
  phone)
- [ ] fix very: train anim length may be inconsistent, just split the sound into 3 or rewrite it with
  requestAnimationFrame ; i fixed the race condition but this is still kinda dumb right now ; my raf fix made it better
  in terms of lags but introduced a new issue, i need to remake the animation from scratch ; anime rofl

- [x] todo semi-prod: responsive
- [x] todo semi-prod: translate everything
- [x] todo semi-prod: little end bit
- [x] todo semi-prod: reduce linktree lag
  ; from my testing the lags i often observe are purely from hmr refreshes spawning too much of something so not an
  issue for a normal user except on phone, there maybe the limit of webgl contexts is lower? either way some chimes just
  die or dont render there, it's not lag per se. so nothing to fix here, plus doesn't lag on my mom's igpu so it's good
  to go probably ; it does still kinda lag on entry when extended tho so improve perf anyway
- [x] todo semi-prod: inconsistent annoying layout shift caused by chimes supposedly, possible css rather than js
  issue? ; can't for the god of me replicate this in prod which could be a bad thing, or a good thing
- [x] todo semi-prod: settings (including sounds)
- [x] todo semi-prod: update this screenie
- [x] todo semi-prod: center chimes for 100% and 150% zoom
- [x] todo semi-prod: error page
- [x] todo semi-prod: title anim
- [x] todo semi-prod: og
- [x] todo semi-prod: diplomas ; make them available only with key from resume,
  and filter commit history for them too, they're not really private and the resume is public anyway,
  but hell knows yer stalkere
- [x] todo semi-prod: supabase keepalive, and one for ohthatsuseful while i'm at it too
- [ ] todo semi-prod: linktree -> web sec animation
- [x] todo semi-prod: make lang switcher change "original" ; did something better

- [x] todo: other seg
- [x] todo: other responsive
- [ ] fix minor-ish: footer shifts layout i think ; it was the display name animation of the rotatie card, 
      not sure why it happens since it's all absolute but demoting this since it's really hard to trigger for a normal user
- [ ] fix minor: snow spawns a boinkie once in a blue moon
- [ ] todo: test snow performance better
- [ ] todo: more minor things like the cat, they just add a lot of purple to the scene
- [x] todo: readme
- [x] fix very: web sec edit is borken
- [ ] todo very very: train working inconsistently (remake from the ground up)
- [ ] fix: might be worth putting a few more concrete results on each project like core features or rough timelines so people see you actually ship
- [ ] fix: web sec arrow only ever appears for the first time you click a project
- [ ] todo: make buttons data driven
- [x] todo very: sort certificates by group and relevancy, in reverse historical/relevancy order 
- [ ] todo minor: cert watermark still says Maksiks www

- [ ] fix very: occuboincal is still there fuck ; guess i want to remake that animation from the ground up with no css, or state, just use motion ig
