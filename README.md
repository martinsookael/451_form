451_form
========

Current status:
http://451.ee:3000/

Short description:  
451.ee helps you to remove illegal content from internet.

Team:  
Ele-Riin Kullamä  
Silver Meikar  
Martin Sookael

Volunteer help:  
Merilin Mandel  
Andri Möll


A bit longer description:  
1. Embeddable lightweight form.  
![alt tag](https://raw.github.com/martinsookael/451_form/master/public/images/mock1.gif)  
![alt tag](https://raw.github.com/martinsookael/451_form/master/public/images/mock2.gif)  
2. Asks for server WHOIS information.  
3. Generates a e-mail(s) from the input from form.  
![alt tag](https://raw.github.com/martinsookael/451_form/master/public/images/mock3.gif)  
4. Logs some of the data from the forms to a database.  
5. Displays graphics and log about the inputed data.  
![alt tag](https://raw.github.com/martinsookael/451_form/master/public/images/mock4.gif)

Specs: Back:  
NodeJs  
Express  
Parse.com  
Nodemailer https://github.com/andris9/Nodemailer  
Whois - https://npmjs.org/package/whoisclient

Specs: Front:  
Jade  
Stylus  
JQuery  
Form validator - http://parsleyjs.org/ (or - https://github.com/caolan/forms )  
Raphaël (Graphs) -  http://raphaeljs.com/   or Paper.js  
Tooltips - Tipsy  
Block robots

Testing:  
What should we use for testing?

Routes:  
Form - free / paied service  
Statistics - shows the statistics with a few Raphael grapsh

To consider:  
Forever - runst the app  
How will it come up after server restart

Pushed to future versions:
Localization - i18n - https://github.com/mashpie/i18n-node


