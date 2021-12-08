// (function() {
// 	// Schedule Template - by CodyHouse.co
// 	function ScheduleTemplate( element ) {
// 		this.element = element;
// 		this.timelineItems = this.element.getElementsByClassName('cd-schedule__timeline')[0].getElementsByTagName('li');
// 		this.timelineStart = getScheduleTimestamp(this.timelineItems[0].textContent);
// 		this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems[1].textContent) - getScheduleTimestamp(this.timelineItems[0].textContent);
// 		this.topInfoElement = this.element.getElementsByClassName('cd-schedule__top-info')[0];
// 		this.singleEvents = this.element.getElementsByClassName('cd-schedule__event');
// 		this.coverLayer = this.element.getElementsByClassName('cd-schedule__cover-layer')[0];
// 		this.initSchedule();
// 	};

// 	ScheduleTemplate.prototype.initSchedule = function() {
// 		this.scheduleReset();
// 	};

// 	ScheduleTemplate.prototype.scheduleReset = function() {
// 		// according to the mq value, init the style of the template
// 		var mq = this.mq(),
// 			loaded = Util.hasClass(this.element, 'js-schedule-loaded');
// 		if( mq == 'desktop' && !loaded ) {
// 			Util.addClass(this.element, 'js-schedule-loaded');
// 			this.placeEvents();
// 		} else if( mq == 'mobile' && loaded) {
// 			//in this case you are on a mobile version (first load or resize from desktop)
// 			Util.removeClass(this.element, 'cd-schedule--loading js-schedule-loaded');
// 			this.resetEventsStyle();
// 		} else {
// 			Util.removeClass(this.element, 'cd-schedule--loading');
// 		}
// 	};

// 	ScheduleTemplate.prototype.resetEventsStyle = function() {
// 		// remove js style applied to the single events
// 		for(var i = 0; i < this.singleEvents.length; i++) {
// 			this.singleEvents[i].removeAttribute('style');
// 		}
// 	};

// 	ScheduleTemplate.prototype.placeEvents = function() {
// 		Util.removeClass(this.element, 'cd-schedule--loading');
// 	};

// 	ScheduleTemplate.prototype.mq = function(){
// 		//get MQ value ('desktop' or 'mobile') 
// 		var self = this;
// 		return window.getComputedStyle(this.element, '::before').getPropertyValue('content').replace(/'|"/g, "");
// 	};

// 	function getScheduleTimestamp(time) {
// 		//accepts hh:mm format - convert hh:mm to timestamp
// 		time = time.replace(/ /g,'');
// 		var timeArray = time.split(':');
// 		var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
// 		return timeStamp;
// 	};

// 	var scheduleTemplate = document.getElementsByClassName('js-cd-schedule'),	
// 		scheduleTemplateArray = [],
// 		resizing = false;

// 	if( scheduleTemplate.length > 0 ) { // init ScheduleTemplate objects
// 		for( var i = 0; i < scheduleTemplate.length; i++) {
// 			(function(i){
// 				scheduleTemplateArray.push(new ScheduleTemplate(scheduleTemplate[i]));
// 			})(i);
// 		}

// 		window.addEventListener('resize', function(event) { 
// 			// on resize - update events position and modal position (if open)
// 			if( !resizing ) {
// 				resizing = true;
// 			}
// 		});

// 		function checkResize(){
// 			for(var i = 0; i < scheduleTemplateArray.length; i++) {
// 				scheduleTemplateArray[i].scheduleReset();
// 			}
// 			resizing = false;
// 		};
// 	}
// }());

function hide(id) {
 	$(".schedule-"+id).addClass("hide");
};

function show(id) {
 	$(".schedule-"+id).removeClass("hide");
};

function scheduleNumber_update() {
  if (max_len>0) 
    document.getElementById("schedule-number").innerHTML = "" + (current_schedule+1) + "/" + max_len;
  else 
    document.getElementById("schedule-number").innerHTML = "" + current_schedule + "/" + max_len;
}

prev_schedule = function(event) {
  if (current_schedule>0) {
  	hide(current_schedule);
  	current_schedule--;
  	show(current_schedule);
  }
  
  scheduleNumber_update();
};

next_schedule = function(event) {
  if (current_schedule<max_len-1) {
  	hide(current_schedule);
  	current_schedule++;
  	show(current_schedule);
  }

  scheduleNumber_update();
};

document.getElementById("btn-prev").onclick = prev_schedule;
document.getElementById("btn-next").onclick = next_schedule;