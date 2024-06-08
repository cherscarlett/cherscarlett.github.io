export const home = {
    heading: 'Cher Scarlett',
    paragraphs:  [
        'I am a student studying physics, mathematics, astronomy, and earth and marine sciences at Orange Coast College. I work at the planetarium teaching the community about earth, space, and aerospace engineering. I practice observational and computational astronomy.',
        'My research interests include solar and extrasolar ocean worlds,  exoplanetary cryospheres, exoplanetary atmospheres, exoplanetary magnetospheres, exomoons, abiogenisis, atmospheric evolution, planetary and lunar migration, atmospheric evolution, atmospheric gravity waves, cloud physics, plasma physics, particle physics, and compact objects.',
        'I taught myself to code in middle school. I\'ve been programming for more than 20 years and have worked in a variety of industries in large corporations such as Apple, Activision Blizzard, Starbucks, and USA Today.',
        'I care deeply for community and involve myself in public policy and community science. I am a passionate advocate of equitable human rights.'
    ]
}

export const resume = {
    heading: 'Resume',
}

export const fun = {
    heading: 'Fun Stuff',
    paragraphs:  [
        'In order to make myself stand out as a candidate early in my career, and to fight for more equitable pay, I built fun themed resume applications and other things.',
        'Here are a few of my favorites, along with other things I\'ve built in my free time.'
    ]
}

export const writing = {
    heading: 'Published works',
}

export type Content = {
    heading: string,
    subHeading?: string,
    paragraphs?: string[]
}