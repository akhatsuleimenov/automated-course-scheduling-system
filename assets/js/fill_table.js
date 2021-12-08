"use strict";
async function fetchJSON() {
  const response = await fetch("/schedule.json");
  const schedules = await response.json();
  return schedules;
}
fetchJSON().then(schedules => {
  max_len = schedules.length;
  if (max_len>0) 
    document.getElementById("schedule-number").innerHTML = "" + (current_schedule+1) + "/" + max_len;
  else 
    document.getElementById("schedule-number").innerHTML = "" + current_schedule + "/" + max_len;


  for (var k = 0; k < schedules.length; k++) {
    var schedule = schedules[k][0];
    
    //SCHEDULE
    var schedule_div = document.createElement("div");
    schedule_div.className = "cd-schedule margin-top-sm margin-bottom-sm js-cd-schedule";
    schedule_div.className += " schedule-"+k;
    if (k>0) schedule_div.className += " hide";

    //TIMELINE
    var timeline_div = document.createElement("div");
    timeline_div.className = "cd-schedule__timeline";
    var timeline_ul = document.createElement("ul");
    timeline_ul.id = "timeline-elements";
    var minutes = [":00",":30"];
    for (var hr = 9; hr < 21; hr++) {
      for (var mn = 0; mn < minutes.length; mn++) {
        var timeline_li = document.createElement("li");
        var timeline_span = document.createElement("span");
        if (hr<10) timeline_span.innerHTML = "0"
        timeline_span.innerHTML += "" + hr + minutes[mn];

        timeline_li.appendChild(timeline_span);
        timeline_ul.appendChild(timeline_li);
      }
    }
    timeline_div.appendChild(timeline_ul);
    schedule_div.appendChild(timeline_div);

    //EVENTS
    var events_div = document.createElement("div");
    events_div.className = "cd-schedule__events";
    events_div.id = "schedule";
    var events_ul = document.createElement("ul");

    let sun = new Array, mon = new Array, tue = new Array, wed = new Array, thu = new Array;
    for (var i=0; i < schedule.length; i++) {
      schedule[i].event_id = i;
      if (schedule[i]["days"].includes("U")) sun.push(schedule[i]);
      if (schedule[i]["days"].includes("M")) mon.push(schedule[i]);
      if (schedule[i]["days"].includes("T")) tue.push(schedule[i]);
      if (schedule[i]["days"].includes("W")) wed.push(schedule[i]);
      if (schedule[i]["days"].includes("R")) thu.push(schedule[i]);
    }
    var weekdays = [sun,mon,tue,wed,thu];
    var weekdays_names = ["sun","mon","tue","wed","thu"];
    var weekdays_full_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    // <div class="cd-schedule__events" id="schedule"> DO WE NEED ID??
    //   <ul>
    //     <li class="cd-schedule__group">
    //       <div class="cd-schedule__top-info"><span>Sunday</span></div>
    //       <ul id="ul-sun">
    for (var weekday = 0; weekday < weekdays.length; weekday++) {
      var events_li = document.createElement("li");
      events_li.className = "cd-schedule__group";
      var events_topinfo_div = document.createElement("div");
      events_topinfo_div.className = "cd-schedule__top-info";
      var events_topinfo_span = document.createElement("span");
      events_topinfo_span.innerHTML = weekdays_full_names[weekday];
      events_topinfo_div.appendChild(events_topinfo_span);
      events_li.appendChild(events_topinfo_div);
      var events_weekday_ul = document.createElement("ul");
      events_weekday_ul.id = "ul-"+weekdays_names[weekday];

      var slotHeight = 30;//events_topinfo_div.offsetHeight;
      //var timelineItems = document.getElementsByClassName('cd-schedule__timeline')[0].getElementsByTagName('li');
      var timelineStart = getStringToTimestamp("9:00");//getStringToTimestamp(timelineItems[0].textContent);
      var timelineUnitDuration = 30;//getStringToTimestamp(timelineItems[1].textContent)-timelineStart;
      var cur = weekdays[weekday];

      for (var i = 0; i < cur.length; i++) {
        var start = getNumberToTimestamp(cur[i]["start_date"]);
        var duration = getNumberToTimestamp(cur[i]["end_date"]) - start;
        var courseTop = slotHeight*(start - timelineStart)/timelineUnitDuration;
        var courseHeight = slotHeight*duration/timelineUnitDuration;

        //create a course element
        var name = document.createElement("em");
        name.className = "cd-schedule__name ";
        name.innerHTML = cur[i]["name"].split(" - ")[1];
        var text = document.createElement("a");
        text.dataset.start = getNumberToStringTime(cur[i]["start_date"]);
        text.dataset.end = getNumberToStringTime(cur[i]["end_date"]);
        text.dataset.event = "event-"+cur[i]["event_id"];
        text.dataset.prof = cur[i]["instructor"];
        text.dataset.schedule = k;
        text.appendChild(name);
        var tag = document.createElement("li");
        tag.className = "cd-schedule__event";
        //if (k != current_schedule) tag.className = "cd-schedule__event hide " + "schedule-" + k;//!!!
        //else tag.className = "cd-schedule__event " + "schedule-" + k;
        tag.appendChild(text);

        //position a course element
        tag.setAttribute('style', 'top: '+(courseTop-1)+'px; height: '+(courseHeight +1)+'px');

        //add a course element into html file
        events_weekday_ul.appendChild(tag);
      }
      events_li.appendChild(events_topinfo_div);
      events_li.appendChild(events_weekday_ul);
      events_ul.appendChild(events_li);
    }

    events_div.appendChild(events_ul);
    schedule_div.appendChild(events_div);

    //COVER LAYER
    var cover_div = document.createElement("div");
    cover_div.className = "cd-schedule__cover-layer";
    schedule_div.appendChild(cover_div);

    //document.body.prepend(schedule_div);
    document.getElementById("schedules-slider").appendChild(schedule_div);
  }

  var src = "assets/js/util.js";
  $('<script>').attr('src', src).appendTo('body');
  var src = "assets/js/main.js";
  $('<script>').attr('src', src).appendTo('body');


  function getStringToTimestamp(time) {
    //accepts hh:mm format - convert hh:mm to timestamp
    var timeArray = (time+"").split(':');
    var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
    return timeStamp;
  }

  function getNumberToTimestamp(time) {
    //accepts hh.mm/60 format - convert hh.mm/60 to timestamp
    var timeStamp = Math.trunc(time)*60 + Math.round((time%1)*60);
    return timeStamp;
  }

  function getNumberToStringTime(time) {
    //accepts hh.mm/60 format - convert hh.mm/60 to hh:mm
    var hour = "" + Math.trunc(time);
    var min = "" + Math.round((time%1)*60);
    while (min.length<2) min = "0"+min;
    return hour + ":" + min;
  }
});