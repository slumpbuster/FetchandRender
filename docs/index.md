# FetchandRender
<img src="./FetchandRender.png" height="300px" width="300px"/>

## Description 
API Data Fetch and Render of the screen based on the data

## Purpose 
This was done as an assignment in the MIT course - Full Stack Development with Mern

---------

## Technologies Used 
- HTML
- Javascript
- CSS

---------

## Installation 
- Clone this repository to your local machine
- Open a command line on your computer and run the command cd path-to-project-root (this should be the actual directory where the repository is located on your local machine)
- Within the same command-line window, run npm install http-server which will allow you to fire up a web server to access the paage
- Once the command completes successfully, run http-server -c-1
- Open your browser of choice and browse to http://127.0.0.1:8080/

## How to Run 
- When the page is loaded in your browser, choose a city from the dropdown to see what is available in that city
- When a city is selected then a new list of options sill be displayed
- The toggle switch of Has Details will show sports with/without details
- The toggle switch of Has Icons will show sports with/without icons
- The text input field allows you to search for specific sports. You must click the search button to fire the search.
- Click on a sport to get more information on the right side of the apge
- Hover over the sport to get a description
- at the bottom of the page there is a First, Selection Drop Down, and Last Option to sort through the pages

---------

## Files 
- **/index.html** - Start-up file to be opened by browser
- **/FandR.jsx** - Call API, Build Form and code for search, toggle, sports info display (Render ReactDOM)
- **/style.css** -  Stylesheet file that positions objects, controls text, colors, and layout
- **/cities.js** -  List of cities with various info (need for latitute and longitude)
- **/fetchandrender.png** -  Screenshot for readme

---------

---------

## Contributing 
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[The MIT License (MIT)](https://github.com/slumpbuster/Formik/blob/main/LICENSE)
