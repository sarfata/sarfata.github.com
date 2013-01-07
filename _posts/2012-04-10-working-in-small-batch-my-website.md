---
layout: post
permalink: /posts/working-in-small-batch-my-website.md
excerpt: |
  # Working in small batch: starting a website
  
  I tend to have tons of great ideas of stuff to do, but quite sadly most of them just end up in a huge mental stack that never seems to go down. The more ideas I have, the more frustrated I get that nothing actually gets *done*.
  The luckiest ones get my attention for a few days, but no matter how much time I spend, they never leave the state of great ideas that I just did not finish.
  
  Those symptoms are not unlike the problems that a lot of companies face: they spend a lot of time working on new features, on a new process that will revolutionize how work is done but often nothing gets out of that work: no code is rolled in production or the slides end up in the trash of an executive that will never have time to approve them.
  When dealing with products, agile practices encourage small iterations and frequent releases. In a company, lean practices recommend working in very small batch that follow a complete design-develop-test cycle. It occured to me recently, that those principles could very well be applied to my own personal projects: building this website for example.
  
---

# Working in small batch: starting a website
		
## Switching to small batch

I tend to have tons of great ideas of stuff to do, but quite sadly most of them just end up in a huge mental stack that never seems to go down. The more ideas I have, the more frustrated I get that nothing actually gets *done*.
The luckiest ones get my attention for a few days, but no matter how much time I spend, they never leave the state of great ideas that I just did not finish.

Those symptoms are not unlike the problems that a lot of companies face: they spend a lot of time working on new features, on a new process that will revolutionize how work is done but often nothing gets out of that work: no code is rolled in production or the slides end up in the trash of an executive that will never have time to approve them.
When dealing with products, agile practices encourage small iterations and frequent releases. In a company, lean practices recommend working in very small batch that follow a complete design-develop-test cycle. It occured to me recently, that those principles could very well be applied to my own personal projects: building this website for example.

## Personal pages

I bought sarfata.org a long time ago and first uploaded a static html page that I updated when I had something to say. It was very basic: some `<p>` some `<hr>` and I had a perfectly fine website for the early 2000s. A few years ago, I upgraded this website to wordpress and hosted it on a rented server. I migrated my older posts from html to wordpress and posted a very few articles. This server hosted a few wordpress sites and unfortunately got hacked one day (the forensic analysis of this server is a story for another day). When I realized that the server was compromised, I backuped the content and turned it off. Since then, sarfata.org is just a blank page.

## Task list

Away on vacations, I started having more and more ideas of things to publish on my no-longer blog. As I thought about a new version of this site, it quickly became an exciting project involving nodeJS, a git-based publication system and markdown for writing article (see [Joe Hewitt description of his new website][joe-hewitt-dropbox-publish] for more ideas).

One sometime has to stop his brain to limit the difference between ideas and actions. Thinking small batch and deciding to commit myself to work in short burst, each followed by an output has made a tremendous difference to how I looked at this project. It was no more about how many fun technologies I am going to learn on the way but rather how simple I could make it.

I have learnt that jumping right in a code editor (or photoshop for the more design-inspired) is never the correct way to start a project. Pen and paper are amazing tools whose power I am slowly starting to acknowledge. I made a list of the tasks needed to roll a first version of this website:

* Storyboard the homepage
* Storyboard an article page
* Design the homepage and the article page in photoshop
* Build the homepage and article page in html
* Upload an empty homepage
* Write and upload an about me page

The incredible power of tasks list is that they allow you to realize that even the simplest thing like &#8220;building a homepage in static html&#8221; actually involves a lot more.

## Design and implementation

![Using Omnigraffle to design the website](/img/omnigraffle.png)

I had bought Omnigrafle on my iPad a while ago and decided to give it a try for simple storyboarding. It turned out to be a great tool. I used the web browser from the recently included Konagi stencils to give perspective and constraints to my design, shared layers to reuse header and footer accross my two pages, and blocks of random text from the same stencils kit to simulate content. In about an hour, I had my two pages designed.

The Omnigrafle result looked so good that I skipped the design phase (I would not have done much better in Photoshop anyways) and jumped to html. I had heard about grid css framework to quickly bootstrap a project and chose Skeleton (getskeleton.org) after a quick google search. I am kind of ashamed to say that it feels good to finally design again with tables in mind &#8230;

I had to rework the todo list a little bit after that because my storyboard included my twitter feed which I had not thought about in my first list. This could mean switching to some dynamic technology (rails or nodejs probably) which would really slow down my project. I dont tweet that often so I just updated the todo list to:
* Take my last 3 tweets and include them manually in the html
* Add a link to twitter page
* Write/design the about page
* Write a first article: building this website
* Put the article in html
* Update home with a link to the article
* manual ssh upload of content

Note that although I kept things simple by avoiding completely the twitter integration during the first batch, I also added the complexity of writing a first article which was not part of the initial todo list: I only realized this while writing this article.

![Using Textastic to write this article in markdown format](/img/textastic.png)

So I did write this article using Textastic on the iPad in markdown format, saved it to html and included it in my blank article page. I synced it with my computer using Dropbox, commited it in a private git repository, and pulled it on my free EC2 micro instance where I already had a virtual host for the domain.

## Conclusion

Focusing on a small project with a simple outcome (have a website online) has helped me to avoid the usual trap of making things way more complicated than they need. It is a lot harder than it seems and I actually did a lot more than I had thought (Google Analytics, including images, resizing them, etc).

To fully apply lean principles, it is important to understand how to measure the outcome of each batch so that I can focus the next ones on the tasks that bring the more value. Finding how to measure the value brought to me by those personal projects is a an interesting new problem ...

## References
* I found [Joshua Johnson article][skeleton-intro] on design hack to be the best introduction to skeleton.

[joe-hewitt-dropbox-publish]: http://joehewitt.com/2011/10/03/dropbox-is-my-publish-button
[skeleton-intro]: http://designshack.net/articles/css/build-a-responsive-mobile-friendly-web-page-with-skeleton/