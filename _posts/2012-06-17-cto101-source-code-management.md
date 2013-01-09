---
layout: post
permalink: /posts/cto101-source-code-management.md
---

CTO 101: Source code management
===============================

About CTO101
------------

CTO101 is a series of guidelines for entrepreneurs who have great ideas but have not found yet the CTO that will help their company grow. It is all about giving you the tools you need to work effectively with freelance developers, hosters and 3rd party tools.

What is SCM?
------------

Source Code Management (or SCM) is the combination of a processes and tools that allow a company to effectively manage the source code for different projects.

In a nutshell, SCM allows you to:

*  Share source code between developers and let several developers work on the same projects at the same time;
*  Protect your source code by keeping a complete history of all files and very frequent backups;
*  Track versions so that you can work on a new version of an application, and still keep the current version source code to write and publish bugfixes.

<!-- more -->

Why do you need SCM when you don't have developers?
---------------------------------------------------

As your company grows, the developers who work for you will build more and more source code. They probably already use some form of source code management internally (if not, run away!) but you should always require them to use a source control system that is under your control.

A few reasons for that:

* Source code is one of the most important intellectual property asset of startups. As an adviser to investors, it amazes me to see that some company just have a ZIP file and are not really sure of what is in it...
* Your contractor might disappear: are you ready to start from scratch and loose several months re-doing what was done before?
* Deciding to switch to another contractor should be one of the rights that you can use without permission from the previous contractor. 
* Having one source control system for everyone will also help you make sure that the history, versions and branches of your projects are saved and always accessible.

How does SCM work?
------------------

### Push or Commit

To interact with a SCM system, every developer will get an account (a login and some form of identification). Initially, source code will be pushed by one of the developers and then all the others will pull it from the system.

When one of the developer does changes to the source code, she will push (or commit) the changes to the server where other developers will pull them. If a conflict arises between the work of two developers, the one who tries to push last will have to solve the conflice on her computer before pushing it.

### Tag

If a version of the software is shipped, the current version of the source code will be tagged. This means that using the tag name, it will always be possible to go back to the exact source code that was used for this version.

### Branch

When major works need to be done on a new version but the old version must also be maintained (which eventually happens to all software projects), a branch will be created for the new version. You can think of it as a copy of the project (like project-v2) except that branches keep the history of the files and let developers move fix from the old version to the new one (or vice-versa) easily. This is called a merge and at this point, you probably know more about SCM than you ever wished for!

How do you set-up SCM?
----------------------

People who think developers do not like fashion should look at the world of SCM. There really are some trends that have evolved over the years. [CVS] was once the big kid in town, then [Apacke Subversion][subversion] took over and more recently, written and promoted by Linus Torvalds who uses it for the Linux kernel development, [Git] has became the most popular source code management tool. You might read online that it is a de-centralized source code management system which is true, but for our startup purpose, we will make sure that everyone pushes their changes to a central place.

Different companies have popped-up on the web that offers Git hosting for a small monthly fee. The two most famous are [Github] and [Atlassian's BitBucket][bitbucket]. They both offer a great web interface to manage your projects and users and will let you browse the source code and probably more important for you: the history messages (also called log) that developers write to detail their changes when they push something.

* [Bitbucket pricing][bitbucket-pricing] is free for up to 5 users and an unlimited number of projects. After that, you have to pay: $10 for 10 users, $25 for 25 users, etc.

* Github is only free if your project source code is public. To make it private, you will need to get an organization account and pay. [Pricing][github-pricing] starts at $7 for 5 repositories (you can think as one repository as being the same thing as one project), $12 for 10, $22 for 20, etc. They also offer "business" accounts ($25 for 10 repositories and up) which give you more flexibility in the management of permission and billing.

With both companies, you can start small and upgrade later. Bitbucket will let you start for free where you need to pay at least $7 a month with Github to keep your code private. The choice depends on your specific situation (number of projects, number of developers). My very own personal opinion today is that Github is more popular than Bitbucket and you will find more developers who know Github than Bitbucket.

### A few words of advice

1. The name of the primary account you will open, should be the name of your organization. Open it with a general email (like contact@mydomain.com or cto@mydomain.com). You will probably want to transfer this to someone else later and it should not be your personal email address.
1. Do not invite anyone to the account yet, you will create one repository per project and invite your developers to each project individually. You probably do not want all your developers to look at all your projects.
1. Invite yourself to your projects so that you can see what the interface looks like and checkout the source code on your computer.

### Initial push

Now that your account is set-up, invite your developers to their project. They will get an email asking them to signup with an existing account on the service or to create a new one. Of course this will be free for them. Github is so popular than any developer should be able to get it to work, there is tons of help available online, if they tell you that they can't use it, you should worry.

When they start pushing changes, go to the project pages in your web interface. You will see your project files popping up, as well as messages from your developers with every change.

Tools are nothing without process
---------------------------------

Having an SCM is nice but it is useless if it is not used right. Here are a few rules you should enfore from most-basic to more advanced ideas.

### Every push should have a log message associated

When developers push or commit something, they should always write down in the 'message box' what they did and why. It can be as simple as this: "Changed the company logo" or more detailed: "fixing bug #42: the price of the basket is now the sum of the items".

Log messages will help you understand what are the pushes about, but more importantly, they will let other developers (today or in two years) understand why things were done like this.

### Every developer must use his own account

Do not skimp on user-accounts by letting several people share the same account. You want to be able to know who has been writing what. Each developer needs a separate scm account.

### The project must be buildable from the source code

Using SCM to share the source code is great but we also want to make sure that the source code is complete. The only way to check this is to have someone take the source code from SCM on a "clean computer" and build it.

If you dont know how to do this, I would strongly recommend getting some help to do that. It will only take a few hours to get stuff straightened out (and eventually documented) when you have developers working on the project available. If you do it in three months when the developers are on vacations, it might take a lot longer!

### Always ship from source

Arguably, this is harder to achieve but really is the best way to make sure that source control is complete: you should never ship something that is not coming directly from source control. Once again, the best way to do that is to download the source from SCM and compile it on another computer than the developer's.

Once you have pushed your new version of website or application, tag it into the source code management system.

Going further
-------------

SCM is one of the most essential tools of developers. Now that you have that set up, you should take a look at the issue trackers that are included in Github and Bitbucket plans. Tracking bugs efficiently is key when developing a project!


[github]: http://www.github.com/
[bitbucket]: http://bitbucket.org/
[github-pricing]: https://github.com/plans
[bitbucket-pricing]: http://bitbucket.org/plans
[cvs]: http://en.wikipedia.org/wiki/Concurrent_Versions_System
[subversion]: http://en.wikipedia.org/wiki/Apache_Subversion
[git]: http://en.wikipedia.org/wiki/Git_(software)
