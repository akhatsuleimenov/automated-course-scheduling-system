//hide schedules with given id
function hide(id) {
 	$(".schedule-"+id).addClass("hide");
};

//show schedules with given id
function show(id) {
 	$(".schedule-"+id).removeClass("hide");
};

//update shown schedule number
function scheduleNumber_update() {
  if (max_len>0) 
    document.getElementById("schedule-number").innerHTML = "" + (current_schedule+1) + "/" + max_len;
  else 
    document.getElementById("schedule-number").innerHTML = "" + current_schedule + "/" + max_len;
}

//show previous schedule
prev_schedule = function(event) {
	hide(current_schedule);
  //if negative, show last
	current_schedule = ((current_schedule - 1) + max_len) % max_len;
	show(current_schedule);
  scheduleNumber_update();
};

//show next schedule
next_schedule = function(event) {
  hide(current_schedule);
  //if exceeds max_len show first
  current_schedule = (current_schedule + 1) % max_len;
  show(current_schedule);
  scheduleNumber_update();
};

document.getElementById("btn-prev").onclick = prev_schedule;
document.getElementById("btn-next").onclick = next_schedule;