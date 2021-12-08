"use strict";
//fetch schedules list
async function fetchJSON() {
  const response = await fetch("https://raw.githubusercontent.com/akhatsuleimenov/automated-course-scheduling-system/main/code/backend/json_files/calendar.json");
  const schedules = await response.json();
  return schedules;
}
fetchJSON().then(schedules => {
  //store schedules number
  max_len = schedules.length;

  //display alert message if schedules list is empty
  if (!max_len) {
    alert("Valid schedules cannot be generated");
    $("buttons").addClass("hide");
  } 

  //update shown schedule number
  if (max_len>0) 
    document.getElementById("schedule-number").innerHTML = "" + (current_schedule+1) + "/" + max_len;
  else {
    document.getElementById("schedule-number").innerHTML = "" + current_schedule + "/" + max_len;
  }

  //create each schedule in html file
  for (var k = 0; k < schedules.length; k++) {
    var schedule = schedules[k];
    
    //create schedule div
    var schedule_div = document.createElement("div");
    schedule_div.className = "cd-schedule margin-top-sm margin-bottom-sm js-cd-schedule";
    schedule_div.className += " schedule-"+k;
    if (k>0) schedule_div.className += " hide";

    //create timeline
    createTimeline(schedule_div);

    //create courses
    var events_div = document.createElement("div");
    events_div.className = "cd-schedule__events";
    events_div.id = "schedule";
    var events_ul = document.createElement("ul");

    //split schedule courses into weekdays
    let sun = new Array, mon = new Array, tue = new Array, wed = new Array, thu = new Array;
    for (var i=0; i < schedule.length; i++) {
      schedule[i].event_id = i;
      if (schedule[i]["status"]=="Wait List") schedule[i].event_id = -1;
      if (schedule[i]["days"].includes("U")) sun.push(schedule[i]);
      if (schedule[i]["days"].includes("M")) mon.push(schedule[i]);
      if (schedule[i]["days"].includes("T")) tue.push(schedule[i]);
      if (schedule[i]["days"].includes("W")) wed.push(schedule[i]);
      if (schedule[i]["days"].includes("R")) thu.push(schedule[i]);
    }
    var weekdays = [sun,mon,tue,wed,thu];
    var weekdays_names = ["sun","mon","tue","wed","thu"];
    var weekdays_full_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

    //create courses for each weekday
    for (var weekday = 0; weekday < weekdays.length; weekday++) {
      var events_li = document.createElement("li");
      events_li.className = "cd-schedule__group";
      //display weekday title
      var events_topinfo_div = document.createElement("div");
      events_topinfo_div.className = "cd-schedule__top-info";
      var events_topinfo_span = document.createElement("span");
      events_topinfo_span.innerHTML = weekdays_full_names[weekday];
      events_topinfo_div.appendChild(events_topinfo_span);
      events_li.appendChild(events_topinfo_div);
      var events_weekday_ul = document.createElement("ul");
      events_weekday_ul.id = "ul-"+weekdays_names[weekday];

      var slotHeight = 30;
      var timelineStart = getStringToTimestamp("9:00");
      var timelineUnitDuration = 30;
      var cur = weekdays[weekday];

      //create courses of certain weekday
      for (var i = 0; i < cur.length; i++) {
        //calculate course position
        var start = getNumberToTimestamp(cur[i]["start_date"]);
        var duration = getNumberToTimestamp(cur[i]["end_date"]) - start;
        var courseTop = slotHeight*(start - timelineStart)/timelineUnitDuration;
        var courseHeight = slotHeight*duration/timelineUnitDuration;

        //create course element
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
        tag.appendChild(text);

        //position course element
        tag.setAttribute('style', 'top: '+(courseTop-1)+'px; height: '+(courseHeight +1)+'px');

        //add course element into parent node
        events_weekday_ul.appendChild(tag);
      }
      events_li.appendChild(events_topinfo_div);
      events_li.appendChild(events_weekday_ul);
      events_ul.appendChild(events_li);
    }

    events_div.appendChild(events_ul);
    schedule_div.appendChild(events_div);

    //add schedule div to html file
    document.getElementById("schedules-slider").appendChild(schedule_div);
  }

  //append main script to html
  var src = "codes/assets/js/main.js";
  $('<script>').attr('src', src).appendTo('body');

  //convert time in string(hh:mm) into timestamp(total minutes)
  function getStringToTimestamp(time) {
    var timeArray = (time+"").split(':');
    var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
    return timeStamp;
  }

  //convert time encoded by number([hh].[mm/60]) into timestamp(total minutes)
  function getNumberToTimestamp(time) {
    var timeStamp = Math.trunc(time)*60 + Math.round((time%1)*60);
    return timeStamp;
  }

  //convert time encoded by number([hh].[mm/60]) into string(hh:mm)
  function getNumberToStringTime(time) {
    var hour = "" + Math.trunc(time);
    var min = "" + Math.round((time%1)*60);
    while (min.length<2) min = "0"+min;
    return hour + ":" + min;
  }

  //create timeline
  function createTimeline(parent) {
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
    parent.appendChild(timeline_div);
  }
})
.catch((error) => {
  $("buttons").addClass("hide");
  alert("Ooops, something went wrong:( Please, try again later!");
  console.log(error);
});