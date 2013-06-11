---
layout: post
---

Although my Orange [Pebble][pebble] has not arrived yet, I had to start digging around the [SDK][pebblesdk]. As always the first step is to [install it][pebblesdkinstall] on your computer.

![Orange Pebble](http://i.imgur.com/YK57o.jpg)

The official approach might seem a little complicated to some developers and is not available on Windows. In this post, I suggest using [Vagrant][vagrant] to set-up a development virtual machine. You will be ready in a few minutes and it works on every platforms.

<!-- more -->

Note that you can also use [CloudPebble][cloudpebble] to compile apps online without having to download anything.

## What is Vagrant?

Quoting from [their website][vagrant], Vagrant lets you _create and configure lightweight, reproducible, and portable development environments_.

In a nutshell, it prepares and starts a headless virtual machine with all the development tools you need. In our case, the virtual machine will have the Pebble SDK ready to use, you will edit the code on your computer and have the virtual machine compile your code.

## Install the Pebble SDK through Vagrant

First you will need to install Vagrant on your computer. [Download Vagrant][vagrantdownload] for your platform. Once you have installed Vagrant, you will also need to install [VirtualBox][virtualbox] if you do not have it already (it's a free alternative to VMWare).

Now create a new directory on your computer and run the following command:

    vagrant init pebblesdk1.1.1 https://s3.amazonaws.com/pebblesdk/pebblesdk-1.1.1.box

Vagrant will download an image of Ubuntu 12.04 with the PebbleSDK pre-installed and will create a new instance of that machine for your project.

To start this virtual machine, simply type:

    $ vagrant up
    Bringing machine 'default' up with 'virtualbox' provider...
    [default] Setting the name of the VM...
    [default] Clearing any previously set forwarded ports...
    [default] Creating shared folders metadata...
    [default] Clearing any previously set network interfaces...
    [default] Preparing network interfaces based on configuration...
    [default] Forwarding ports...
    [default] -- 22 => 2222 (adapter 1)
    [default] Booting VM...
    [default] Waiting for VM to boot. This can take a few minutes.
    [default] VM booted and ready for use!
    [default] Configuring and enabling network interfaces...
    [default] Mounting shared folders...
    [default] -- /vagrant

Your virtual machine is starting and you can connect to it using `vagrant ssh`. The `/vagrant` folder of your virtual machine is synchronized to the current folder on your computer.

To create a new project, you can run the `create_pebble_project` command:

    macbookpro$ vagrant ssh
    Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-23-generic-pae i686)

     * Documentation:  https://help.ubuntu.com/
    Welcome to your Vagrant-built virtual machine.
    Last login: Tue Jun 11 00:26:31 2013 from 10.0.2.2
    
    vagrant@precise32:~$ cd /vagrant
    vagrant@precise32:/vagrant$ create_pebble_project myfirstwatchface

    Creating project here:

    	/vagrant/myfirstwatchface

    Now run:

    	cd myfirstwatchface
    	./waf configure
    	./waf build
      
To finalize the initialization of your first project, run:
      
    cd myfirstwatchface
    ./waf configure
      
Look on your computer, a `myfirstwatchface` folder should have appeared in your current directory. You can use your favorite editor and source-control tool to write your app.  When you want to compile it, just go back to your ssh session and type `./waf build`.

For more information on how to get started writing watchfaces and apps for Pebble, [read the docs][pebblesdkdoc]!

To save some RAM and disk space (~1.5Gb) you can destroy the virtual machine at anytime (`vagrant destroy`). Of course, it will not touch your project files on your computer. The next time you need it, just run `vagrant up` and it will be ready again in a few seconds.

## Q&A

Hope this helps some of you get started with the Pebble SDK! Feel free to post questions in the comments below or on the [Pebble forum][pebbleforum].

### Post-Scriptum: How to prepare the Vagrant image?

For the sake of repeatability, here is how I prepared the image:

 * Start from a precise32 image

<!-- leave list mode -->
    vagrant init precise32 http://files.vagrantup.com/precise32.box
    vagrant up    
    vagrant ssh

 * Install everything

<!-- leave list mode -->
    # Update apt database
    sudo apt-get update

    # Install pre-requisite
    sudo apt-get install libmpc2

    # Now install pebble sdk
    mkdir pebble-dev
    cd pebble-dev

    # Download and install arm toolkit
    wget http://developer.getpebble.com/files/sdk-release-001/arm-cs-tools-ubuntu-12.04-2012-12-22.tar.bz2
    tar -jxf arm-cs-tools-ubuntu-12.04-2012-12-22.tar.bz2
    rm arm-cs-tools-ubuntu-12.04-2012-12-22.tar.bz2

    echo 'export PATH=~/pebble-dev/arm-cs-tools/bin:$PATH' >> ~/.bash_profile

    # Install SDK dependencies
    sudo apt-get install dpkg-dev python-dev python-pip

    # Install SDK
    mkdir PebbleKit-v1.1.1
    cd PebbleKit-v1.1.1
    tar -zxf /vagrant/PebbleKit-v1.1.1.tar.gz

    # Installing python modules for the SDK
    pip install --user -r PebbleKit-v1.1.1/Pebble/sdk/requirements.txt

    # Create a handy alias to create_pebble_project.py
    echo 'alias create_pebble_project="~/pebble-dev/PebbleKit-v1.1.1/Pebble/tools/create_pebble_project.py ~/pebble-dev/PebbleKit-v1.1.1/Pebble/sdk"' >> ~/.bash_profile

    # Clean up
    sudo apt-get clean  

 * Finally prepare the image

<!-- leave list mode -->    
    vagrant package
    

[pebble]: http://getpebble.com
[pebblesdk]: https://github.com/pebble/pebblekit/
[cloudpebble]: https://cloudpebble.net/
[pebblesdkinstall]: http://developer.getpebble.com/1/01_GetStarted/01_Step_1
[vagrant]: http://vagrantup.com
[vagrantdownload]: http://downloads.vagrantup.com/
[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[pebblesdkdoc]: http://developer.getpebble.com/1/02_Guides/01_AppsVsWatchfaces
[pebbleforum]: http://forums.getpebble.com/discussion/5951/install-the-sdk-in-minutes-on-any-operating-system-with-vagrant