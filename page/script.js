

$(document).ready(function() {
	for (var i = 0; i<courses['classes'].length; i++){
		newdiv1 = document.createElement( "div" );
		text = document.createElement("div");

		infoclass = document.createElement("div");
		infoclass.className = "lelel";
		// text.innerHTML = courses['classes'][i].name;
		text.className = "aligngood";
		
		newdiv1.className = 'outerdiv';

		openinfo = document.createElement("span");
		openinfo.className = "iconify blya";
		openinfo.setAttribute("data-icon", "ant-design:caret-down-filled");

		infoclass.append(openinfo);
		infoclass.append(courses['classes'][i].name);
		
		text.append(infoclass);

		//button for adding the courses to the cart in the bottom
		addbutton = document.createElement("span");
		addbutton.className = "iconify";
		addbutton.id = "addcourse";
		addbutton.setAttribute('data-icon', "carbon:add-filled");
		lalal = document.createElement("div");
		res = document.createElement("p");
		res.innerHTML = "Add Course";
		res.className = "addbuttonstate";
		lalal.append(res);
		lalal.className = "addbutton";
		lalal.append(addbutton);
		lalal.style.display = "flex";

		text.append(lalal);
		newdiv1.append(text);
		/////////////////////////////////////////////////////////

		newdiv2 = document.createElement( "div" );
		newdiv2.className = 'innerdiv';
    	newdiv2.innerHTML = courses['classes'][i].title + "<br />";
    	newdiv2.append(checkwaitlist(courses['classes'][i].status, i));
    	newdiv1.append(newdiv2);
	    $('#classes').append(newdiv1);
	}
});

function checkwaitlist(given, num) {
	let res = document.createElement("p");
	res.innerHTML = given;
	if (given == "Wait List") {
		res.style.color = "#f0d533";
		res.innerHTML = given + ' (' + courses['classes'][num].waitlist_count + ')';
	}
	else if (given == "Closed") res.style.color = "red";
	else res.style.color = "green";
	return res;
}



document.addEventListener('DOMContentLoaded', function() {
	let classes = document.querySelectorAll(".lelel");
	let openspan = document.querySelectorAll(".blya");
	let info = document.querySelectorAll(".innerdiv");
	// let addcourse = document.getElementById("addcourse");

	for (var i = 0; i < classes.length; i++)(function(i) {
		// classes[i].appendChild(addcourse);
		classes[i].onclick = function() {
			console.log(openspan[i])
			if (info[i].style.display=='block'){
				info[i].style.display = "none";
				openspan[i].setAttribute("data-icon", "ant-design:caret-down-filled");
			}else {
				info[i].style.display = 'block';
				openspan[i].setAttribute("data-icon","ant-design:caret-up-filled");
			}
		}
	})(i);
})


addedcourses = []
let picked = document.querySelector(".picked");

document.addEventListener('DOMContentLoaded', function() {
	
	let buttons = document.querySelectorAll(".addbutton");
	let addbuttonstate = document.querySelectorAll(".addbuttonstate");
	let classes = document.querySelectorAll(".outerdiv");

	for (var i = 0; i< buttons.length; i++) (function(i) {
		buttons[i].onclick = function() {
			if (addbuttonstate[i].innerHTML == "Add Course"){
				addedcourses.push(courses['classes'][i].name);
				$(buttons[i]).addClass("changecolor");
				addbuttonstate[i].innerHTML = "Added";
			} else{
				addbuttonstate[i].innerHTML = "Add Course";
				$(buttons[i]).removeClass("changecolor");
				addedcourses.indexOf(courses['classes'][i].name) !== -1 && addedcourses.splice(addedcourses.indexOf(courses['classes'][i].name), 1);
			}
			showaddedcourses();
		}

	}) (i);
})

function showaddedcourses(){
	picked.innerHTML = "Courses Picked: "
	for (var i = 0; i < addedcourses.length-1; i++) {
		picked.innerHTML = picked.innerHTML + addedcourses[i] + ", ";
	}

	if (addedcourses.length > 0)  picked.innerHTML = picked.innerHTML + addedcourses[addedcourses.length-1];
}
// document.querySelectorAll(".outerdiv").forEach(button =>
// 	button.addEventListener("click", () => {
// 		console.log("aaa")
// 	})
// )

function myFunction() {
    var input, filter	, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    let classes = document.querySelectorAll(".outerdiv");
    for (i = 0; i < classes.length; i++) {
        a = classes[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a.style.display = "";
        } else {
            a.style.display = "none";
        }
    }
}