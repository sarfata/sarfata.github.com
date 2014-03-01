---
title: Minima
layout: post
---

The [Minima](http://www.phonestack.com/farhan/minima.html) is an amateur radio receiver and transmitter designed by [Ashaar Farhan](http://www.phonestack.com/farhan/).

### Characteristics

Its main characteristics are:

 - General coverage: 0 to 30 Mhz
 - Single Side Band modulation and CW
 - Output power of about 1 W with the original amplifier (more on that later)
 - The frequency is set by a Si570 Digitally Controlled Oscillator
 - An Arduino-style micro-controller is used to control the front-panel and drive the oscillator which makes the entire project very easily hackable

### Links

 If you are interested in this project:

 - Join the [Minima mailing list](http://www.phonestack.com/farhan/minima.html) (Subscription form at the top of the page)
 - Read [the official Wiki](http://hfsignals.org) for the Minima and Radiono (the name given to the software)

### My minima

I was looking for a first home-brew project when Farhan announced the Minima and ended up being one of the early builders of this project. I am using this page to share construction notes in the hope that they will help future builders. I bought the first parts and started building on january 24th 2014 and listened to my few QSOs on feb 27th.



## Building and Testing the crystal filter

I used an Arduino connected to a AD9850 DDS board to generate an input signal and characterize the crystal filter ([source code of my signal generator](https://github.com/sarfata/ad9850_siggen)). I did not have the equipment to characterize the crystals properly so the selection was just random.

![](/ham/images/minima-crystalfilter-testing-dds.jpg)

I started taking notes on paper and quickly moved to Google Spreadsheets:

![](/ham/images/minima-crystalfilter-testing.jpg)

[![](https://docs.google.com/spreadsheet/oimg?key=0As9CZnZ-A5a2dEZaM1dlWVdVX3pXaUlJMXd0cHNscHc&oid=3&zx=5c6i42iskxv4)](https://docs.google.com/spreadsheet/ccc?key=0As9CZnZ-A5a2dEZaM1dlWVdVX3pXaUlJMXd0cHNscHc&usp=drive_web#gid=1)

[Google spreadsheet document](https://docs.google.com/spreadsheet/ccc?key=0As9CZnZ-A5a2dEZaM1dlWVdVX3pXaUlJMXd0cHNscHc&usp=drive_web#gid=1)

### Lessons learnt

 - How to properly measure RF power with an Oscilloscope
 - The importance of 50 ohm impedance matching
 - How to measure the output impedance of a generator
 - Building a LC network to do impedance matching
 - 50 ohms termination

### References

The Minima group was super helpful and pointed me in the right directions for a lot of basic RF knowledge that I was lacking:

 - [On power measurements and basic RF bench techniques](http://www.qrp.pops.net/RF-workbench-1.asp)

## Winding my first toroids

I got myself an [AADE L/C Meter](http://aade.com/lcmeter.htm) to measure the inductance of the toroids I am winding. For $100 you get a very nice kit to build in one quick evening including front panel, buttons and decals. The enclosure is pre-cut and drilled, you just have to solder. This little instrument has an excellent reputation in the ham radio community and is super useful.

Don't buy one of the cheap LCR meters on Amazon or eBay, most of them cannot measure anything smaller than a few nano-farads or micro-henris. We work with much smaller values in RF.

Winding the toroids is not very fun but it is pretty easy. I have found [toroids.info](http://www.toroids.info) to be a great resource. It will tell you how many turns you need on your cores and what is the approximate length of magnetic wire you need.

For reference, these are the values [Mark](http://g0mgx.blogspot.co.uk/search/label/BITX%20Minima) used and mine:

| Part | Value  | Core    | N-Turns (Mark) | N-Turns (Thomas) |
|------|--------|---------|----------------|------------------|
| L2   |   3 uH |     T33 |             17 | 16               |


## Building the Low pass filters


Glued the toroids in place
Soldered the toroids and then adjusted inductance before locking them with nails-polish
Used qrpme mepads

![](/ham/images/minima-lpf.jpg)

![](/ham/images/minima-lpf-top.jpg)

## Building the main board

![](/ham/images/minima-mainboard.jpg)

![](/ham/images/minima-lcd.jpg)

## Debugging the minima

![](/ham/images/minima-complete-rx.jpg)


## First sounds

