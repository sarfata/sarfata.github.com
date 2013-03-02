---
layout: post
title: Fun with Huawei E3131A USB 3G modem - Mac setup
---

# Fun with Huawei E3131A USB 3G modem - Mac setup

As some of you know, I am spending a bit of time (six months) in Senegal. Last week, Orange Senegal ran a promotion: their 3G Internet usb key was available for 10000 FCFA (~15€/$20), including one week of unlimited data access. I already have Internet access through my phone but I thought this would be a fun new toy, especially if I could get it working on the Raspberry Pi as well.

![Picture of Orange 3G modem](/img/orange-huawei-3g-modem.jpg)

[Huawei] is one of those huge chinese companies who are changing the face of Telcom but we almost never hear about them. They provide everything from software to run a mobile network to cheap phones and 3g devices.

It turns out this little device is quite amazing: Internet access works on the Mac but also on Linux, I can use it to send and receive SMS and you can even configure it to [act as a USB ethernet card and access its embedded web server][huawei-hilink]... quite amazing for $20!

A nice bonus is that the key I got is not sim-locked so I can use it with any network (if yours is locked and you happen to google 'huawei + the model of your key', it's hard to find anything but unlocking instructions...).

<!-- more -->

## Installation

I try to stay away from "official" drivers provided by operators: they usually install a lot of bloated software on your computer and do not work very well.

When I plugged this key in my Mac, it automatically added three new serial ports, a network interface (more on this later) and a few usb storage device.

The USB storage device contain the official drivers and I recommend staying away from them as much as possible. The first USB serial device is all you need as you will see.

Bottom line, is you do not need to install anything. Just plug it in.

## Configuring Internet Access

Going online is probably the first thing you want to do with your new 
3G modem. 

Simply open your Mac Network Preferences, select the Huawei Modem in the list on the left and:

 * In Telephone number, write `*99#` - this is the special number used to activate 3G/GPRS access
 
![Configuring 3G USB Modem - Phone number](/img/3gmodem-step1.png)

 * Click "Advanced"
 ** Choose Model: 'GPRS(GSM/3G)'
 ** In APN, type the name of your APN (for Orange Senegal, the APN is just `wap`)

![Configuring 3G USB Modem - APN](/img/3gmodem-step2.png)

Click OK, apply the new configuration. Press "Connect", you are online.

If you are using Orange Senegal, you need to go to [www.passorange.sn][passorange] to choose your plan, recharge it, etc.


## Playing with AT commands

If you are like me, going online is actually not the first thing you will do. The first thing will be to play with the modem and talk to him directly to get acquainted.

It had been a long time since I played with AT commands. It's kind of nice to see that modern usb 3G modems use the same basic commands that my [Olitec 28800][olitec-link].

Using [Coolterm] you can easily talk to your 3G modem: open coolterm, in Settings choose the first USB serial port added by the modem, set speed to 115200 bauds and click "Connect".

The most basic AT command, is just `AT`. The modem should reply with `OK`.

I have made a list of a few interesting command to run, because it still is so much fun to talk to a modem:

 * `at^cardlock?`
   Will tell you whether your modem is sim-locked to an operator or not. If you get a reply that looks like: `^CARDLOCK: 2,10,0` then your modem is not locked. If the first digit is a 1, then your modem is locked.
 * `at^hwver` gives you the hardware version
 * `at+cgmr` gives you the firmware version
 * `at+cops=?` (press enter and wait for a while before the modem replies) returns the list of available networks
 * `at^sysinfo` gives you information on the status of the modem (see reference below to interpret the result)

[This page lists the most useful 3G commands.][common-at-commands]

## Send and receive SMS

Another cool thing you can do is use this little guy to send and receive SMS.

There are some [complicated ways to do this][huawei-sms] which allow you to turn your computer and the key in a full-featured SMS gateway. I am just going to show you the very simple way.

To use those commands, you first need to go into "text mode": `at+cmgf=1`.

Now to send an SMS, you can type: `at+cmgs="+420123456789"`, the modem will respond with `>`. Just type your SMS and when you are done, press Ctrl-Z. Your message will be sent.

To see what SMS have been received, you can type: `at+cmgl="ALL"`. I have not found yet how to delete messages, mark them read, etc. If you know how to do that, please let me know!

## Conclusion

I know a lot of people here in Senegal use old phones plugged into linux box with cheap serial adapters to run SMS gateways. At only $20 (10000F here), this little device is much cheaper than cheap phones and probably a lot easier to get. I think this and the raspberry pi will be a very nice combo.

Configuration Internet access on the Raspberry Pi was not much harder. I will share this sometime soon. 

[huawei]: http://en.wikipedia.org/wiki/Huawei
[huawei-hilink]: http://chaddyhv.wordpress.com/2012/08/13/programming-and-installing-huawei-hilink-e3131-under-linux/
[olitec-link]: http://www.limundo.com/kupovina/Racunari-i-Oprema/Mrezni-uredjaji/Modemi/FAX-MODEM/6818349
[coolterm]: http://freeware.the-meiers.org/
[common-at-commands]: http://3g-modem.wetpaint.com/page/common+AT-commands
[passorange]: http://www.passorange.sn
[huawei-sms]: http://shkspr.mobi/blog/2012/06/raspberry-pi-and-frontline-sms/