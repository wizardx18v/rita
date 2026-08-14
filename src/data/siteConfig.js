// ---------------------------------------------------------------------------
//  SITE CONFIG — default content.
//  Everything can also be edited live from the admin page (#/admin).
//  Admin overrides are stored in localStorage and take priority over these.
// ---------------------------------------------------------------------------

export const siteConfig = {
  // ----- Admin -------------------------------------------------------------
  adminPassword: 'rita2026',

  // ----- Names -------------------------------------------------------------
  herName: '[HER NAME]',
  myName: '[MY NAME]',

  // Date shown on the final "yes" screen.
  today: '[DATE, e.g. August 14, 2026]',

  // ----- Music -------------------------------------------------------------
  // Real Spotify link — the site renders the official Spotify embed for it.
  // Defaults to "Fire on Fire" by Sam Smith.
  spotifyUrl: 'https://open.spotify.com/track/7t3Xdbufg7q2onVsR8RBdY',
  musicTitle: 'There\u2019s a song I still associate with you.',
  musicParagraphs: [
    'Some songs stop being just songs after a while. They become places \u2014 and this one is still yours.',
    'Press play. It\u2019s the one I can\u2019t listen to without thinking of us.',
  ],

  // ----- Memories ----------------------------------------------------------
  // photo: paste a URL or upload from the admin page (stored as data URL).
  memories: [
    {
      date: '[DATE]',
      title: 'That conversation that somehow lasted for hours.',
      text: '[SHORT MEMORY — write one or two sentences in your own words.]',
      photo: '',
      wide: false,
    },
    {
      date: '[DATE]',
      title: '[MEMORY TITLE]',
      text: '[SHORT MEMORY — write one or two sentences in your own words.]',
      photo: '',
      wide: false,
    },
    {
      date: '[DATE]',
      title: '[MEMORY TITLE]',
      text: '[SHORT MEMORY — write one or two sentences in your own words.]',
      photo: '',
      wide: false,
    },
  ],

  // ----- The apology -------------------------------------------------------
  apologyParagraphs: [
    'I owe you an apology. Not the kind that tries to get past the conversation quickly \u2014 the kind I should have sat down and written a long time ago.',
    'I made mistakes. I hurt you, even when I didn\u2019t mean to, and I think the worst part is that I don\u2019t always notice the moment it happens. I said things I can\u2019t take back. I stayed silent when I should have spoken. I let days go by without telling you how I actually felt.',
    'I wasn\u2019t always fair to you. I got defensive when you tried to talk to me. I assumed instead of asked. I took moments for granted and didn\u2019t show you how much they mattered until after they were gone.',
    'I know saying sorry doesn\u2019t undo any of it. I\u2019m not writing this to make myself feel better. I\u2019m writing it because I finally understand what those moments cost you, and you deserved better from me.',
  ],

  // ----- Accountability ----------------------------------------------------
  accountability: [
    'I should have listened instead of becoming defensive.',
    'I should have communicated instead of making assumptions.',
    'I should have appreciated the little things.',
    'I should have thought about how my actions would make you feel.',
    'I should have shown you how much you mattered instead of assuming you already knew.',
  ],

  // ----- Reflection --------------------------------------------------------
  reflectionIntro: 'If I could go back...',
  reflectionLines: [
    'I wouldn\u2019t change meeting you.',
    'I wouldn\u2019t erase the memories.',
    'I wouldn\u2019t pretend none of it mattered.',
    'I would change the moments where I hurt you.',
    'I would listen more.',
    'I would communicate better.',
    'I would appreciate you more.',
    'I would never want you to question how much you meant to me.',
  ],

  // ----- The letter --------------------------------------------------------
  letterParagraphs: [
    'I miss you. That\u2019s the simplest and truest thing I know how to say right now.',
    'I regret hurting you. I\u2019ve gone back through the worst of it in my head more times than I can count, and I keep finding things I should have handled differently.',
    'I\u2019ve thought about my actions \u2014 not to excuse them, but to understand them. Because you didn\u2019t deserve to carry the weight of my mistakes.',
    'I know trust isn\u2019t rebuilt with words. I don\u2019t expect you to instantly forgive me, and I don\u2019t expect you to forget. I don\u2019t expect you to give me another chance simply because I\u2019m asking.',
    'But I want you to know that if you ever let me, I would be grateful for the opportunity to show you that I can do better. Not perfectly. But genuinely, every day, on purpose.',
  ],

  // ----- Final question ----------------------------------------------------
  finalMessage:
    'Not to pretend nothing happened. Not to go back to exactly who we were. But to start again with everything I\u2019ve learned.',

  // ----- Yes experience ----------------------------------------------------
  yesLines: [
    'Then let\u2019s do this properly.',
    'Slowly.\nHonestly.\nTogether.',
    'Thank you for giving us another chance.',
  ],

  // ----- Final screen ------------------------------------------------------
  finalLines: [
    'Whatever happens from here...',
    'Thank you for reading.',
    'I\u2019m sorry.',
    'I love you.',
    'And if you let me...',
    'I\u2019d love to do better this time.',
  ],
}
