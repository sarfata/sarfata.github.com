# Setup your very own VPN server with Amazon EC2

Setting up a VPN server with Amazon EC2 is a great way to protect your privacy. You can turn the server on when you need it, shut it down when you dont. All your traffic will go through your VPN and go out on the internet from your EC2 box so that you are in a really secure environment.

Amazon lets you use a [free instance][amazonfree] for a year that will be perfect for our purpose. And with the help of this post, it should not take more that 5 minutes!

[blackvpn]: https://www.blackvpn.com
[amazonfree]: https://aws.amazon.com/free/

<!readmore/>

This post is a followup to a [first post][firewall-article] in which I introduced the [Voodoo Privacy project][github] and explained how to completely lock down your computer from external access (but also how to prevent your computer from talking too much).

We will see how to see an IPSec / L2TP VPN. They are very secure, and very easy to configure on the client side, supported by most operating systems without any extra tools to download or install.

## Alternatives

If you dont want to go through the trouble of setting up an EC2 box, you can buy a VPN from a provider such as [Black VPN][blackvpn] which will give you a VPN into a country of your choice for only 49€ per year. I think it's a pretty good deal (and they also have a full privacy package which also gives you access to all of their VPN servers including Lithuania, Russia, etc should you have a need for that).

## Amazon EC2 pre-requisites

I am going to assume that you already have an amazon EC2 account and SSH keys set up. If not look around it is really easy (the assistant will actually help you do it when you start your first instance).


## Set up a security group

![Setup your security group](/img/vpn-security-group.png)

Create a new security group (EC2 Management interface -> Security groups) and allow traffic to TCP port 500, and UDP ports 450 and 4500. Also add a rule to allow SSH. I like to limit SSH login from my home/office IP but if you are really brave you can let everyone find your SSH.

## Start a new Ubuntu server

* Get my [voodoo-vpn][github-voodoovpn] script from my github, you dont even need to download it, just copy and paste into a text editor
* Change the default value for the three variables `IPSEC_PSK`, `VPN_USER` and `VPN_PASSWORD` at the top of launch script and copy everything into your clipboard.
* Click on Instances -> Launch Instance -> Classic Wizard -> Ubuntu 12.04 -> 1 micro instance.
* In the user data field, past the launch script you have just adapted.
* Select your keypair
* Select the security group you created earlier
* Give the machine a name
* Click launch

And that's it! Your server is now ready to accept connection from your mac.

## Configure the VPN on your Mac

* Open your network settings
* Click on the "+" button in the top-left corner of the interfaces list
* Select a VPN interface, with 'IPSec L2TP' and give it a name
* In the address field, put the public IP of your server (you can get from the amazon console)
* In the account name field, put the value of the `VPN_USER` variable that you defined earlier.
* Click on auth settings, fill your `VPN_PASSWORD` in the first field and your `IPSEC_PSK` in the second box. Click Ok
* Click on Advanced Settings, select "Send all traffic" and click ok.
* If you are using my [firewall script][firewall-article], update the VPN server address at the top of the script and re-run it to allow VPN traffic to go through to your server.
* Click Connect, it should take a few seconds and you should be online.
* Ask google '[what is my ip address?][google-ipaddress]', you should see the IP address of your Amazon EC2 box

## Debugging

I have done my best to simplify the steps and make it easy to reproduce. If it does not work, there are a few things you can do to debug it.

On your mac, look at `/var/log/ppp.log`, this is what a normal connection looks like: 

    $ tail -f /var/log/ppp.log
    Wed Aug  1 15:48:57 2012 : L2TP connecting to server '<AMAZON_PUBLIC_IP>' (<AMAZON_PUBLIC_IP>)...
    Wed Aug  1 15:48:57 2012 : IPSec connection started
    Wed Aug  1 15:48:58 2012 : IPSec connection established
    Wed Aug  1 15:49:00 2012 : L2TP connection established.
    Wed Aug  1 15:49:00 2012 : L2TP set port-mapping for en1, interface: 4, protocol: 0, privatePort: 0
    Wed Aug  1 15:49:00 2012 : Using interface ppp0
    Wed Aug  1 15:49:00 2012 : Connect: ppp0 <--> socket[34:18]
    Wed Aug  1 15:49:00 2012 : L2TP port-mapping for en1, interfaceIndex: 0, Protocol: None, Private Port: 0, Public Address: 4c7e006a, Public Port: 0, TTL: 0.
    Wed Aug  1 15:49:00 2012 : L2TP port-mapping for en1 inconsistent. is Connected: 1, Previous interface: 4, Current interface 0
    Wed Aug  1 15:49:00 2012 : L2TP port-mapping for en1 initialized. is Connected: 1, Previous publicAddress: (0), Current publicAddress 4c7e006a
    Wed Aug  1 15:49:00 2012 : L2TP port-mapping for en1 fully initialized. Flagging up
    Wed Aug  1 15:49:03 2012 : CHAP authentication succeeded: Access granted
    Wed Aug  1 15:49:03 2012 : local  IP address 192.168.42.10
    Wed Aug  1 15:49:03 2012 : remote IP address 192.168.42.1
    Wed Aug  1 15:49:03 2012 : primary   DNS address 8.8.8.8
    Wed Aug  1 15:49:03 2012 : secondary DNS address 8.8.4.4
    Wed Aug  1 15:49:03 2012 : l2tp_wait_input: Address added. previous interface setting (name: en1, address: 10.0.1.2), current interface setting (name: ppp0, family: PPP, address: 192.168.42.10, subnet: 255.255.255.0, destination: 192.168.42.1).
    Wed Aug  1 15:49:07 2012 : L2TP port-mapping update for en1 ignored: VPN is the Primary interface. Public Address: 0, Protocol: None, Private Port: 0, Public Port: 0
    Wed Aug  1 15:49:07 2012 : L2TP clearing port-mapping for en1


SSH to your amazon box and look at `/var/log/auth.log` and `/var/log/syslog`, this is what a normal connection should look like:

    $ ssh ubuntu@<AMAZON_PUBLIC_IP>
    $ tail -f /var/log/auth.log /var/log/syslog
    ==> /var/log/auth.log <==
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [RFC 3947] method set to=109 
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [draft-ietf-ipsec-nat-t-ike] method set to=110 
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring unknown Vendor ID payload [8f8d83826d246b6fc7a8a6a428c11de8]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring unknown Vendor ID payload [439b59f8ba676c4c7737ae22eab8f582]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring unknown Vendor ID payload [4d1e0e136deafa34c4f3ea9f02ec7285]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring unknown Vendor ID payload [80d0bb3def54565ee84645d4c85ce3ee]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring unknown Vendor ID payload [9909b64eed937c6573de52ace952fa6b]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [draft-ietf-ipsec-nat-t-ike-03] meth=108, but already using method 110
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [draft-ietf-ipsec-nat-t-ike-02] meth=107, but already using method 110
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [draft-ietf-ipsec-nat-t-ike-02_n] meth=106, but already using method 110
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: ignoring Vendor ID payload [FRAGMENTATION 80000000]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: packet from <YOUR_HOME_IP>:500: received Vendor ID payload [Dead Peer Detection]
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: responding to Main Mode from unknown peer <YOUR_HOME_IP>
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: transition from state STATE_MAIN_R0 to state STATE_MAIN_R1
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: STATE_MAIN_R1: sent MR1, expecting MI2
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: NAT-Traversal: Result using draft-ietf-ipsec-nat-t-ike (MacOS X): both are NATed
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: transition from state STATE_MAIN_R1 to state STATE_MAIN_R2
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: STATE_MAIN_R2: sent MR2, expecting MI3
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: ignoring informational payload, type IPSEC_INITIAL_CONTACT msgid=00000000
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: Main mode peer ID is ID_IPV4_ADDR: '10.0.1.2'
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[1] <YOUR_HOME_IP> #1: switched from "vpnpsk" to "vpnpsk"
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: deleting connection "vpnpsk" instance with peer <YOUR_HOME_IP> {isakmp=#0/ipsec=#0}
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: transition from state STATE_MAIN_R2 to state STATE_MAIN_R3
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: new NAT mapping for #1, was <YOUR_HOME_IP>:500, now <YOUR_HOME_IP>:32770
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: STATE_MAIN_R3: sent MR3, ISAKMP SA established {auth=OAKLEY_PRESHARED_KEY cipher=aes_256 prf=oakley_sha group=modp1024}
    Aug  1 22:48:57 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: Dead Peer Detection (RFC 3706): enabled
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: Applying workaround for Mac OS X NAT-OA bug, ignoring proposed subnet
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #1: the peer proposed: 50.18.74.250/32:17/1701 -> <YOUR_HOME_IP>/32:17/0
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: responding to Quick Mode proposal {msgid:001855ba}
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2:     us: <AMAZON_PRIVATE_IP>/32===<AMAZON_PRIVATE_IP><<AMAZON_PRIVATE_IP>>[<AMAZON_PUBLIC_IP>,+S=C]:17/1701---10.171.1.1
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2:   them: <YOUR_HOME_IP>[10.0.1.2,+S=C]:17/50931
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: transition from state STATE_QUICK_R0 to state STATE_QUICK_R1
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: STATE_QUICK_R1: sent QR1, inbound IPsec SA installed, expecting QI2
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: Dead Peer Detection (RFC 3706): enabled
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: transition from state STATE_QUICK_R1 to state STATE_QUICK_R2
    Aug  1 22:48:58 ip-10-171-1-123 pluto[4636]: "vpnpsk"[2] <YOUR_HOME_IP> #2: STATE_QUICK_R2: IPsec SA established transport mode {ESP/NAT=>0x0e800e49 <0x7f060c3f xfrm=AES_256-HMAC_SHA1 NATOA=none NATD=<YOUR_HOME_IP>:32770 DPD=enabled}
    ==> /var/log/syslog <==
    Aug  1 22:49:00 ip-10-171-1-123 xl2tpd[4676]: "/etc/ppp/options.xl2tpd" 
    Aug  1 22:49:00 ip-10-171-1-123 xl2tpd[4676]: "ipparam" 
    Aug  1 22:49:00 ip-10-171-1-123 xl2tpd[4676]: "<YOUR_HOME_IP>" 
    Aug  1 22:49:00 ip-10-171-1-123 xl2tpd[4676]: "/dev/pts/1" 
    Aug  1 22:49:00 ip-10-171-1-123 xl2tpd[4676]: Call established with <YOUR_HOME_IP>, Local: 8159, Remote: 11087, Serial: 1
    Aug  1 22:49:00 ip-10-171-1-123 pppd[4722]: pppd 2.4.5 started by root, uid 0
    Aug  1 22:49:00 ip-10-171-1-123 pppd[4722]: Using interface ppp0
    Aug  1 22:49:00 ip-10-171-1-123 pppd[4722]: Connect: ppp0 <--> /dev/pts/1
    Aug  1 22:49:04 ip-10-171-1-123 pppd[4722]: local  IP address 192.168.42.1
    Aug  1 22:49:04 ip-10-171-1-123 pppd[4722]: remote IP address 192.168.42.10

Remember, there are three _steps_ to the connection:

1. Establish an IPSec connection between your Mac and the Amazon EC2 box, if you can see `STATE_QUICK_R2: IPsec SA established transport mode` in `/var/log/auth.log`, then you have it working.
1. Build an xl2tpd connection between your Mac and the amazon box, if you can see `Call established with <YOUR_HOME_IP>`, then you have that working.
1. Build a ppp connection, if you can see the last three lines in `/var/log/syslog`, then you are good.

If it still does not work, please post in the comment below and let me know what step you have reached. I will do my best to help! If it works, please do also post in the comment below. I would love to know that I have helped someone with this.



[github]: https://github.com/sarfata/voodooprivacy
[github-voodoovpn]: https://github.com/sarfata/voodooprivacy/blob/master/voodoo-vpn.sh
[firewall-article]: /posts/secure-your-mac.md
[google-ipaddress]: https://www.google.com/search?q=what+is+my+ip+address