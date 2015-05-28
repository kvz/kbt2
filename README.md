Yesterday I wrote my first Firefox OS App.

For now it's called [kbt2](https://github.com/kvz/kbt2) and it's round timer that I can use to give
kickboxing lessons.

After:
 - a few very frustrating hours dealing with the unintuitive and sometimes even failing Everlast Round Timer
 - knowing that I could not use my own phone as it will be playing music during kickboxing sessions
 - having a spare [Firefox Developer Preview Phone](https://marketplace.firefox.com/developers/dev_phone) thanks
to a lucky raffle on [Decode Friday](http://www.meetup.com/DecodeFriday/events/119848052/)
 - knowing that building Firefox OS apps is as easy as creating a HTML site with some json for app definition and
JS for making it e.g. vibrate when the timer is done

I decided to use my geekphone as a dedicated interval timer / instruction guide to help give kickboxing training
using this app.

![screen shot 2013-08-12 at 12 14 43 pm](https://f.cloud.github.com/assets/26752/946618/18f77e56-0338-11e3-8f45-0cdc2742907d.png)

![screen shot 2013-08-12 at 12 14 55 pm](https://f.cloud.github.com/assets/26752/946617/1562ef1e-0338-11e3-8ac0-8f427f227701.png)

![screen shot 2013-08-12 at 12 02 21 pm](https://f.cloud.github.com/assets/26752/946571/4cc0affc-0336-11e3-9f27-0dc043aefe6d.png)

It's an offline app so I don't require any reception inside the gym.

Hacked this up on a rainy Sunday afternoon thanks to a headstart with:

 - [Great docs on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/Apps/Getting_Started)
 - [Firefox OS Boilerplate App](https://github.com/robnyman/Firefox-OS-Boilerplate-App) which bundles some common code
 - [Firefox OS Simulator 4.0](https://addons.mozilla.org/en-US/firefox/addon/firefox-os-simulator/) which let me test & refresh with just 1 click

This project is **very** specific to my use-case but open sourced for inspiration
and so that I can more easily install it :)

The Firefox Phone is targetted at upcoming markets so feature-wise it can't really compete - and wont't replace -
your modernday iOS/Android device. However, at just 50$ you get a ton of easy-programmable hardware (cpu, ram,
touchscreen, wifi, usb, etc), which opens up possibilites for all kinds of dedicated applications.
