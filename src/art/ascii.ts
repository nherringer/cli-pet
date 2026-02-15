// ASCII art for each pet species and mood

import { PetSpecies, PetMood } from '../pet/types.js';

const catArt: Record<string, string> = {
  happy: `
    /\\_/\\  
   ( ^.^ ) 
    > ^ <  
   /|   |\\
  (_|   |_)
  `,
  ecstatic: `
    /\\_/\\  ♥
   ( ★▽★) ♥
    > ^ < ♥
   /|   |\\
  (_|   |_)
  `,
  sad: `
    /\\_/\\  
   ( ;.; ) 
    > ^ <  
   /|   |\\
  (_|   |_)
  `,
  hungry: `
    /\\_/\\  
   ( o.o ) 
    > ~ <  
   /|   |\\ ?
  (_|   |_)
  `,
  sick: `
    /\\_/\\  
   ( x.x ) 
    > ~ <  
   /|   |\\
  (_|   |_) ~
  `,
  sleeping: `
    /\\_/\\  
   ( -.- ) z
    > ^ < zz
   /|   |\\zzz
  (_|   |_)
  `,
  playing: `
    /\\_/\\  
   ( >w< ) ~♪
    > ^ <  
   /| _ |\\
  (_|   |_)
  `,
  dead: `
    /\\_/\\  
   ( x_x ) 
    > - <  
   /|   |\\
  (_|___|_)
  `,
};

const dogArt: Record<string, string> = {
  happy: `
   / \\__
  (    @\\___
  /         O
 /   (_____/
/_____/  U
  `,
  ecstatic: `
   / \\__ ♥ ♥
  (    @\\___
  /         O
 /   (_____/
/_____/  U U
  `,
  sad: `
   / \\__
  (    ;\\___
  /         O
 /   (_____/
/_____/  U
  `,
  hungry: `
   / \\__  ?
  (    o\\___
  /         O
 /   (_____/
/_____/  U
  `,
  sick: `
   / \\__  ~
  (    x\\___
  /         O
 /   (_____/
/_____/  U
  `,
  sleeping: `
   / \\__
  (    -\\___  zzz
  /         O
 /   (_____/
/_____/  U
  `,
  playing: `
   / \\__  ♪
  (    >\\___
  /    __   O
 /   (_____/
/_____/  U U
  `,
  dead: `
   / \\__
  (    x\\___
  /         O
 /   (___x_/
/_____/  U
  `,
};

const dragonArt: Record<string, string> = {
  happy: `
      /\\  /\\
     /  \\/  \\
    / (  ^^ ) \\
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  ecstatic: `
      /\\  /\\  🔥
     /  \\/  \\
    / (  ★★ ) \\
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  sad: `
      /\\  /\\
     /  \\/  \\
    / (  ;; ) \\
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  hungry: `
      /\\  /\\
     /  \\/  \\
    / (  oo ) \\
   /  (  <>  ) \\  ?
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  sick: `
      /\\  /\\
     /  \\/  \\  ~
    / (  xx ) \\
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  sleeping: `
      /\\  /\\
     /  \\/  \\
    / (  -- ) \\  zzz
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  playing: `
      /\\  /\\  🔥
     /  \\/  \\
    / (  >< ) \\
   /  (  <>  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ~~~~
  `,
  dead: `
      /\\  /\\
     /  \\/  \\
    / (  xx ) \\
   /  (  --  ) \\
      |      |
     /| /\\ /|\\
    / |/  \\| \\
       ....
  `,
};

const octocatArt: Record<string, string> = {
  happy: `
     MMM
    (o o)
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  ecstatic: `
     MMM   ♥
    (★ ★) ♥
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  sad: `
     MMM
    (; ;)
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  hungry: `
     MMM
    (o o) ?
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  sick: `
     MMM  ~
    (x x)
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  sleeping: `
     MMM
    (- -)  zzz
   /( Y )\\
    \\ | /
     |||
    _|||_
   |     |
  `,
  playing: `
     MMM  ♪
    (> <)
   /( Y )\\
    \\ | / ~
     |||
    _|||_
   |     |
  `,
  dead: `
     MMM
    (x_x)
   /( Y )\\
    \\ | /
     |||
    _|||_
   |_____|
  `,
};

const artMap: Record<PetSpecies, Record<string, string>> = {
  cat: catArt,
  dog: dogArt,
  dragon: dragonArt,
  octocat: octocatArt,
};

export function getAsciiArt(species: PetSpecies, mood: PetMood): string {
  const speciesArt = artMap[species];
  return speciesArt[mood] || speciesArt['happy'];
}

export function getStatusBar(label: string, value: number, emoji: string): string {
  const filled = Math.round(value / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = `${value}%`.padStart(4);
  return `${emoji} ${label.padEnd(10)} ${bar} ${percentage}`;
}
