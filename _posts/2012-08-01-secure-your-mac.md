---
layout: post
permalink: /posts/secure-your-mac.md
excerpt: |
  # How to secure your Mac when using it on wireless networks

  I recently attended the [Defcon] conference which is well know to be the [most hostile network in the world][defcon-hostile]. One common advice is to [hide all your devices][hide-your-devices].

  Of course, you know I could not spend a week without the Internet, so I finally looked into securing my computer which I should have done a long time ago. In this post, I want to share some recommandations on how to really secure your mac computer and protect your privacy when surfing online.

  We will go through setting up the MacOS firewall and a VPN to an amazon EC2 box. This is still quite technical so if you have never opened a terminal this is probably not for you might still want to read the next paragraph to understand the risks and have some basic ideas of how to protect yourself.

  Every script described here is published on my github as the [Voodoo Privacy][github] project.

  [Defcon]: https://www.defcon.org/
  [defcon-hostile]: http://edition.cnn.com/2011/TECH/web/08/05/def.con.hackers/index.html
  [hide-your-devices]: http://www.thetechscoop.net/2011/08/11/def-con-19/
  [github]: https://github.com/sarfata/voodooprivacy
  
---
# How to secure your Mac when using it on wireless networks

I recently attended the [Defcon] conference which is well know to be the [most hostile network in the world][defcon-hostile]. One common advice is to [hide all your devices][hide-your-devices].

Of course, you know I could not spend a week without the Internet, so I finally looked into securing my computer which I should have done a long time ago. In this post, I want to share some recommandations on how to really secure your mac computer and protect your privacy when surfing online.

We will go through setting up the MacOS firewall and a VPN to an amazon EC2 box. This is still quite technical so if you have never opened a terminal this is probably not for you might still want to read the next paragraph to understand the risks and have some basic ideas of how to protect yourself.

Every script described here is published on my github as the [Voodoo Privacy][github] project.

## The risks of public wireless networks and some basic recommandations

When you log onto a public network, you directly connect your computer or your phone to an unsecure network and need to understand that you do not get the same level of protection that you would when you are on your office network or your home network.
Other people around you can listen to your network traffic and they can also connect directly to your computer and access any information that you make publicly available.

A few examples:

* As soon as you connect your computer, phone or tablet, it will start broadcasting your name to everyone on the network. If you are phone is named: "Alice Campbell's iPhone" and you really do not want the creepy guy next to you to know it, this is bad...
* People around you can see what website you go too, what pictures you are looking at, etc
* In a lot of situations, they can also use your connection to those websites to do things under your names (like post facebook pictures, etc)

This is not always a big deal: I dont care that people around me know what books I am shopping for on amazon or what articles I like on the nytimes. 

When you do care, there is a relatively easy and quite efficient way to protect yourself: use HTTPS. If your website url starts with `https://` and your browser shows a little green lock then your communication is crypted and people will not be able to intercept your exchanges.

So **always use https when surfing in public place**, this applies to your gmail account, to facebook or any other social networks that you probably want to keep private.
Also, read carefully the warning from your browser. If it tells you that the certificate for gmail.com or facebook.com can not be verified, it usually means that someone is trying to intercept your communication and put themselves in the middle. If that happens, do not trust the certificate. Get out and go surf somewhere else.

Finally be careful of what you share from your computer. You might have decided to share files when you were at home. Remember that those shares will still be available to other people around you. In any Starbucks with more than 10 poeple, there is always someone sharing pictures of their last holidays... If you dont want to be that person, disable file sharing when you are not using it, or enable the built-in firewall in MacOS (Settings -> Firewall -> Enable firewall).

## Playing with OSX firewall "manually"

Now the built-in firewall is pretty good but if you know what you are doing, I highly recommend direct control of the firewall through a few simple scripts. This will give you the best control on what goes in but also what goes out of your computer.

Since Lion, MacOS uses OpenBSD packet filter which is managed by the `pfctl` command. The basic setup is built around the file /etc/pf.conf which loads some basic rules and provides *anchors* to hook some more rules when you enable the firewall, file sharing, etc.

What [Voodoo Privacy][github] does is that when you want to go into a full secure mode, it loads a different configuration file for the packet filter which does not contain the OS anchors so that even if the firewall or network sharing are enabled, they wont work because only your explicit rules will be effective.

You only need two files (which are available from my [github]), the first one is a shell script to enable the custom rules:

    #!/bin/sh
    #
    # http://www.sarfata.org/posts/secure-your-mac.html
    #
    # Copyright Thomas Sarlandie 2012
    #
    # This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 
    # Unported License: http://creativecommons.org/licenses/by-sa/3.0/
    #
    # Attribution required: please include my name in any published derivative and
    # let me know how you have improved it! 

    COMMAND="$1"
    shift

    case $COMMAND in
    hostile)
      echo "Going into hostile mode. You will be protected."
      # Load pf rules from custom file - Skip Apple default stuff
      pfctl -f voodoo-pf.conf
      # Enable packet filtering
      pfctl -e
      ;;
    safe)
      echo "Going back to Apple default mode"
      pfctl -f /etc/pf.conf
      pfctl -d
      # note: it would be better to use pfctl -X <token> but getting the token 
      # requires parsing the output of 'pfctl -s References'
      ;;
    log)
      ifconfig pflog0 create
      tcpdump -v -n -e -ttt -i pflog0
      ;;
    *)
      echo "$0: <hostile|safe|log>"
      echo " Use hostile when you are on an unsecured network."
      echo " Use safe when you are back on a safe network. This will reset everything back to Apple's default"
      ;;
    esac


The other one is the actual rules that will be loaded ([get the latest version on github][github-voodoopf]):


    # voodoo-pf.conf
    # 
    # Firewall rules. Use with voodoo-safe.sh
    #
    # http://www.sarfata.org/posts/setting-up-an-amazon-vpn-server.md
    #
    # Copyright Thomas Sarlandie 2012
    #
    # This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 
    # Unported License: http://creativecommons.org/licenses/by-sa/3.0/
    #
    # Attribution required: please include my name in any derivative and let me
    # know how you have improved it! 

    # The interface that you will use to connect to an unsecure network
    ext_if = "en1"
    # your VPN server (if you intend to use one)
    ipsec_server = "42.42.42.42"

    # drop everything by default
    set block-policy drop
    # we do not want to filter traffic on "internal" interfaces
    set skip on lo0
    set skip on vmnet1
    set skip on vmnet8
    set skip on vboxnet0

    # Normalize all incoming traffic
    scrub in on $ext_if all fragment reassemble

    # Block and log everything by default - Use pf-lockdown.sh log to see the logs
    block drop log all

    # Block silently some traffic - otherwise the logs get very clogged up
    # I have disabled those lines to let you see the logs and realize all the stuff your
    # computer shares...
    #block on $ext_if proto udp from any port 5353 to any port 5353
    #block out inet6
    #block out on $ext_if proto udp from any to port 137

    # Allow ipsec traffic
    pass out on $ext_if proto tcp from any to $ipsec_server port 500
    pass out on $ext_if proto udp from any to $ipsec_server port 500
    pass out on $ext_if proto udp from any to $ipsec_server port 4500
    pass out on $ext_if proto tcp from any to $ipsec_server port 1701
    pass out on $ext_if proto udp from any to $ipsec_server port 1701

    # Allow dhcp traffic
    pass in on $ext_if proto udp from port 68 to any port 67
    pass in on $ext_if proto udp from port 67 to any port 68
    pass out on $ext_if proto udp from port 67 to any port 68

    # Allow ping to test connection
    pass out on $ext_if inet proto icmp all icmp-type echoreq
    # Allow ssh out
    pass out on $ext_if inet proto tcp to port 22

    # Allow all on vpn
    pass out on ppp0


Copy and paste those lines or (clone my github on your computer), and execute `.sudo /voodoo.sh hostile` to disable OSX default firewall and enable these very basic (and much more strict) rules. Then run `sudo ./voodoo.sh log` to see all the traffic that is being dropped. By default, DNS, HTTP and HTTPS are not allowed so you really wont do much.

You now have three options:

* Customize the rules to allow some traffic that you understand the risks for
* Use a SSH connection to tunnelize some traffic (use the IP address of your server because your computer wont be able to resolve the DNS of your ssh server)
* Connect to a VPN and send all your traffic through the VPN. This is the best option and is covered into [another post][vpn-post].

Oh and when your back at home and want to go back with the default OSX rules, just run `sudo ./voodoo.sh safe`. This will load the default file from `/etc/pf.conf`.


[Defcon]: https://www.defcon.org/
[defcon-hostile]: http://edition.cnn.com/2011/TECH/web/08/05/def.con.hackers/index.html
[hide-your-devices]: http://www.thetechscoop.net/2011/08/11/def-con-19/
[github]: https://github.com/sarfata/voodooprivacy
[vpn-post]: /posts/setting-up-an-amazon-vpn-server.md
[github-voodoopf]: https://github.com/sarfata/voodooprivacy/blob/master/voodoo-pf.conf
