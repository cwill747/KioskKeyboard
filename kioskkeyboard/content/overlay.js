/*
Original Code
FxKeyboard
Version: 1.2
Author:  Marko Zabreznik
Date:    22 Feb 2009
Purpose: Firefox Keyboard

This keyboard has been rebranded for English users, and some functionality
has been changed. All credit for the original code goes to Marko Zabreznik.

Kioskkeyboard
Version 1.6
Author: Cameron Will
Date: 8 Jul 2010
Purpose: Provide a keyboard for a kiosk process
This program is being distributed under the GPL. You must do the same.
http://www.gnu.org/licenses/gpl.html
*/
window.addEventListener("load", function() { KioskKeyboard.startUp(); }, false);
var KioskKeyboard = {
    startUp: function()
    {
		var self = this;
		// globals ---------------------------------------*/
		//The default state of shift, which is non engaged
		this.shift = false;
		//Capslock should also be non engaged
		this.caps = false;
		this.focus;
		this.capsbutton = document.getElementById('kioskkeyboard_caps');
		this.shiftbutton = document.getElementById('kioskkeyboard_shift');
		this.toolbar = document.getElementById('kioskkeyboard_toolbar');
		// draw layout of keys to go on the bottom of the screen*/
		osKeys = new Array ( 
		'1','2','3','4','5','6','7','8','9','0','-','=','_','+',-1,
		'q','w','e','r','t','y','u','i','o','p','[',']','{','}',-1,
		'a','s','d','f','g','h','j','k','l',':',';','#','"','@',-1,
		'z','x','c','v','b','n','m',',','.','/','<','>','?','!');
		var keyboard = document.getElementById('kioskkeyboard_keyboard');
		var tempRow = document.createElement("hbox");var temp;
		for ( var i in osKeys ) {
			if (osKeys[i] == -1) {
				tempRow.setAttribute("flex", '1');
				keyboard.appendChild(tempRow);
				tempRow = document.createElement("hbox");
			}
			else {
				tempRow.appendChild(this.addButton(osKeys[i].toUpperCase(),osKeys[i],osKeys[i].toUpperCase()));
			}
		}
		tempRow.setAttribute("flex", '1');
        keyboard.appendChild(tempRow);
		
		// on click ---------------------------------------*/
		window.addEventListener("DOMContentLoaded", function(aEvent) {
			var thebrowserget = gBrowser.getBrowserForDocument(aEvent.target);
			if(thebrowserget)thebrowserget.addEventListener("click", function() { KioskKeyboard.itemFocused(); }, false);
			KioskKeyboard.toggletoolbar(true);
        }, true);
    },
	itemFocused: function () {
		var focused = document.commandDispatcher.focusedElement;
		if (focused && (focused.type == 'text' || focused.type == 'textarea' || focused.type == "password")) {
			// textarea found, open keyboard
			this.focus = focused;
			this.toggletoolbar(false);
		}
		else {
			this.toggletoolbar(true);
		}
	},
	toggletoolbar: function(set){
		this.toolbar.collapsed = set;
	},
	buttonAction: function(button) {
		if (this.shift) {
			this.focus.value+=(button.action2);
			this.doShift();
		}
		else
			this.focus.value+=(button.action1);
	},
	addButton: function(name, action1, action2) {
        tempButton = document.createElement("button");
        tempButton.setAttribute("label", name);
        tempButton.setAttribute("tooltiptext", name);
        tempButton.setAttribute("flex", '1');
		tempButton.action1 = action1;
		// simple test if it is a character
		if (name.toLowerCase() !== name.toUpperCase()) tempButton.style.fontWeight="bold"
		tempButton.style.minWidth="40px"
		tempButton.style.height="40px"
		tempButton.action2 = action2;
        tempButton.setAttribute("oncommand", 'KioskKeyboard.buttonAction(this)');
		return tempButton;
	},
	doShift: function (){
		if (this.caps) return;
		this.shift = !this.shift;
		this.shiftbutton.style.color = (this.shift) ? "#ff0000" : '#000000';
	},
	doCaps: function (){
		if (this.caps) {
			this.shift = this.caps = false;
			this.capsbutton.style.color = this.shiftbutton.style.color = '#000000';
		}
		else {
			this.shift = this.caps = true;
			this.capsbutton.style.color = this.shiftbutton.style.color = '#ff0000';
		}
	},
	doBackspace: function (){
		this.focus.value = this.focus.value.slice(0, -1);
	},
	doClear: function (){
		this.focus.value='';
	},
	doEnter: function (){
		this.focus.value+='\r';
	},
	doSpace: function (){
		this.focus.value+=' ';
	}
}
// END KioskKeyboard
