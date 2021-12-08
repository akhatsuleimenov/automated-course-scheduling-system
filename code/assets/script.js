
//creating the lists for adding classes to the cart and then doing somoething with it

let addedcourses = []
let addedcoursesindex = []
let addedcoursesshort = []
let addedcoursestitles = []
let outputjson = []


//buttons that are in cart to remove

let cls = []


//by the start of the website we create the search part
$(document).ready(function() {
	//looking through the json to find the corresponding courses and use the information from it to create the list of courses
	for (var i = 0; i<courses['classes'].length; i++){
		let thiscourse = courses['classes'][i];
		newdiv1 = document.createElement( "div" );
		text = document.createElement("div");

		infoclass = document.createElement("div");
		infoclass.className = "lelel";

		text.className = "aligngood";
		
		newdiv1.className = 'outerdiv';

		openinfo = document.createElement("span");
		openinfo.className = "iconify";
		openinfo.setAttribute("data-icon", "ant-design:caret-down-filled");

		infoclass.append(openinfo);
		infoclass.append(thiscourse[0].name);
		
		text.append(infoclass);

		//button for adding the courses to the cart in the bottom
		addbutton = document.createElement("span");
		addbutton.className = "iconify";
		addbutton.id = "addcourse";
		addbutton.setAttribute('data-icon', "carbon:add-filled");
		lalal = document.createElement("div");
		res = document.createElement("p");
		res.innerHTML = "Add";
		res.className = "addbuttonstate";
		lalal.append(res);
		lalal.className = "addbutton";
		// lalal.append(addbutton);
		lalal.style.display = "flex";

		text.append(lalal);
		newdiv1.append(text);
		/////////////////////////////////////////////////////////

		newdiv2 = document.createElement( "div" );
		newdiv2.className = 'innerdiv';

		//using the fucntionto show the classes if weopne the course description
    	newdiv2.append(showinsideclass(thiscourse, i));
    	newdiv1.append(newdiv2);
	    $('#classes').append(newdiv1);


	    //getting the information about the button to add the class to the cart and then to delete it

	    let insidebuttons = document.querySelectorAll(".add" + i);
	    let insidebuttonstate = document.querySelectorAll(".insidestate" + i);
	    let buttons = document.querySelectorAll(".addbutton");
	    let addbuttonstate = document.querySelectorAll(".addbuttonstate");
	    let class_available = document.querySelectorAll(".class_available"+i);

 		for (var j  = 0; j < insidebuttons.length; j++) (function(j,i) {
 			insidebuttons[j].onclick = function() {

 				//if the class is closed we notify the user that it can't be added
 				if (class_available[j].innerHTML == "Closed") {
 					alert("This class is closed, can't be added");
 				}

 				//if another class with the same name is added already, it can't be added, since only one specific could be created
 				else if (addbuttonstate[i].innerHTML == "Added" && insidebuttonstate[j].innerHTML == "Add") {
 					alert ("Two classes with same names can't be added");
 				}

 				//in other cases, if we can add the class, we add it to our lists and then execute the functioin that shows all teh courses in the cart
				else if (insidebuttonstate[j].innerHTML == "Add"){
					if (addedcourses.length === 9) {
						alert("Maximum of 9 courses allowed!")
					} else {
						addedcourses.push(thiscourse[j].name);
						addedcoursesindex.push(i);
						addedcoursesshort.push(thiscourse[j].name.slice(0,thiscourse[j].name.indexOf(" - ")) + " " + thiscourse[j].title.slice(thiscourse[j].title.indexOf("("),thiscourse[j].title.indexOf(")")+1));
						addedcoursestitles.push(thiscourse[j].title);

						$(insidebuttons[j]).addClass("changecolor");
						insidebuttonstate[j].innerHTML = "Added";

						$(buttons[i]).addClass("changecolor");
						addbuttonstate[i].innerHTML = "Added";
					}
				//the same as the code above, but we delete the class from cart and lists if we remove the class 
				} else{
					changeinsdidecl(i,"no");
					addbuttonstate[i].innerHTML = "Add";
					$(buttons[i]).removeClass("changecolor");
					insidebuttonstate[j].innerHTML = "Add";
					$(insidebuttons[j]).removeClass("changecolor");
					deleteindexfromarray(addedcourses.indexOf(thiscourse[j].name), addedcoursesshort );
					deleteindexfromarray(addedcourses.indexOf(thiscourse[j].name), addedcoursesindex );
					deleteindexfromarray(addedcourses.indexOf(thiscourse[j].name), addedcoursestitles );
					addedcourses.indexOf(thiscourse[j].name) !== -1 && addedcourses.splice(addedcourses.indexOf(thiscourse[j].name), 1);
				}

				//showing the classes in the cart
				showaddedcourses();	
			}
		}) (j,i);
	}
});

//if the class is closed/waitlisted/open we show the corresponding color for it

function checkwaitlist(given, num, check) {
	let res = document.createElement("p");
	res.className = "class_available" + num;
	res.innerHTML = given;
	if (given == "Wait List") {
		res.style.color = "#f0d533";
		res.innerHTML = given + ' (' + courses['classes'][num][check].waitlist_count + ')';
	}
	else if (given == "Closed") res.style.color = "red";
	else res.style.color = "green";
	return res;
}

//this function is for showing the inside of the classes when pressed on the drop down button
function showinsideclass(given, num) {

	divforclasses = document.createElement('div');
	divforclasses.className = "gridofclassesinside";
	for (var i = 0; i < given.length; i++) {
		
		//button creation
		addbutton = document.createElement("span");
		addbutton.className = "iconify";
		addbutton.id = "addcourse";
		addbutton.setAttribute('data-icon', "carbon:add-filled");
		lalal = document.createElement("div");
		res = document.createElement("p");
		res.innerHTML = "Add";
		res.className = "insideaddbuttonstate insidestate" + num;
		lalal.append(res);
		lalal.className = "insideclassesaddbutton add" + num;
		////

		divforclass = document.createElement('div');
		divforclass.className = "insideclasses";
		divforclass.innerHTML = given[i].name + "<br />"  + given[i].title;
		let inst = document.createElement("p");
		inst.append(given[i].instructor);
		divforclass.append(inst);
		// divforclass.append();

		toalignbutton = document.createElement('div');
		toalignbutton.className = "toalignbutton";
		toalignbutton.append(checkwaitlist(given[i].status,num,i));
		toalignbutton.append(lalal);

		divforclass.append(toalignbutton);
		divforclasses.append(divforclass);
	}
 	
	return divforclasses;
	// }
}


//the following code block adds onclick event for the dropdown buttons for showing the inside of the classes
document.addEventListener('DOMContentLoaded', function() {
	let classes = document.querySelectorAll(".lelel");
	let info = document.querySelectorAll(".innerdiv");

	for (var i = 0; i < classes.length; i++)(function(i) {

		classes[i].onclick = function() {
			if (info[i].style.display=='block'){
				info[i].style.display = "none";

			}else {
				info[i].style.display = 'block';
			}
		}
	})(i);
})



let picked = document.querySelector(".picked");
//the following code adds the onclick event for the add button fo the big classes and does the saem as in the code block above about add buttons for subclasses
document.addEventListener('DOMContentLoaded', function() {
	
	let buttons = document.querySelectorAll(".addbutton");
	let addbuttonstate = document.querySelectorAll(".addbuttonstate");
	let classes = document.querySelectorAll(".outerdiv");

	for (var i = 0; i< buttons.length; i++) (function(i) {
		buttons[i].onclick = function() {
			if (addbuttonstate[i].innerHTML == "Add"){

				//checks if teh number of added courses is no more than 9
				if (addedcourses.length === 9) {
					alert("Maximum of 9 courses allowed!")
				} else {
					if (changeinsdidecl(i,"add") === "ok") {
						addedcourses.push(courses['classes'][i][0].name);
						addedcoursesindex.push(i);
						addedcoursesshort.push(courses['classes'][i][0].name.slice(0,courses['classes'][i][0].name.indexOf(" - ")));
						addedcoursestitles.push("");
						$(buttons[i]).addClass("changecolor");
						addbuttonstate[i].innerHTML = "Added";
					}
				}
			} else{
				changeinsdidecl(i,"no");
				addbuttonstate[i].innerHTML = "Add";
				$(buttons[i]).removeClass("changecolor");
				deleteindexfromarray(addedcourses.indexOf(courses['classes'][i][0].name), addedcoursesshort );
				deleteindexfromarray(addedcourses.indexOf(courses['classes'][i][0].name), addedcoursesindex );
				deleteindexfromarray(addedcourses.indexOf(courses['classes'][i][0].name), addedcoursestitles );
				addedcourses.indexOf(courses['classes'][i][0].name) !== -1 && addedcourses.splice(addedcourses.indexOf(courses['classes'][i][0].name), 1);
			}
			showaddedcourses();
		}

	}) (i);

})

//this funtcion changes the subclasses of a class if the class is added to the cart, so other courses can't be added
function changeinsdidecl(j, state) {
	let class_available = document.querySelectorAll(".class_available"+j);
	let insidebuttons = document.querySelectorAll(".add" + j);
	let insidebuttonstate = document.querySelectorAll(".insidestate" + j);
	
	if (insidebuttons.length === 1 && class_available[0].innerHTML == "Closed") {
		alert("This class is closed, can't be added");
		return "no";
	}
	for (var i = 0; i < insidebuttons.length; i++) {
		if (state == "add" && class_available[i].innerHTML != "Closed") {
			$(insidebuttons[i]).addClass("changecolor");
			insidebuttonstate[i].innerHTML = "Added";
		}
		else if (state != "add" && class_available[i].innerHTML != "Closed"){
			$(insidebuttons[i]).removeClass("changecolor");
			insidebuttonstate[i].innerHTML = "Add";
		}
		
	}
	return "ok"
	
}

//this function deletes an element from an array with given index
function deleteindexfromarray(i, arr){
	i !== -1 && arr.splice(i,1);
}

//this functioin shows thecourses inside the cart
function showaddedcourses(){
	picked.innerHTML = "Courses Picked (" + addedcourses.length + "/9)";
	let buttons = document.querySelectorAll(".addbutton");
	let addbuttonstate = document.querySelectorAll(".addbuttonstate");
	
	for (var i = 0; i < addedcourses.length; i++) {

		let course = pickedcourse(i, addbuttonstate, buttons, "norm");
		picked.append(course);
	}

	let closebuttons = document.querySelectorAll(".closebuttons");

	for (var i = closebuttons.length - 1; i >= 0; i--) (function(i){
		closebuttons[i].onclick = function() {
			let indextodelete = i;

			if (indextodelete !== -1) {
				addbuttonstate[addedcoursesindex[indextodelete]].innerHTML = "Add";
				$(buttons[addedcoursesindex[indextodelete]]).removeClass("changecolor");
				changeinsdidecl(addedcoursesindex[indextodelete],"no");
				deleteindexfromarray(indextodelete, addedcourses);
				deleteindexfromarray(indextodelete, addedcoursesindex);
				deleteindexfromarray(indextodelete, addedcoursestitles);
				deleteindexfromarray(indextodelete, cls);
				indextodelete !== -1 && addedcoursesshort.splice(indextodelete, 1);
				showaddedcourses();
			}

		}
	}) (i);

}

//the following function creates a picked course divs
function pickedcourse(i, addbuttonstate, buttons, check) {
	newdiv = document.createElement( "div" );
	newdiv.className = "pickedclasses";
	if (check == "norm") newdiv.innerHTML = addedcoursesshort[i];
	// else 
	closebutton = document.createElement("div");
	closebuttonimg = document.createElement("span");
	closebuttonimg.className = "iconify closebutton";
	closebuttonimg.setAttribute("data-icon", "eva:close-fill");
	closebutton.append(closebuttonimg);
	closebutton.className = "closebuttons";

	
	newdiv.append(closebutton);
	cls.push(closebutton);
	return newdiv;
	
}

//this function is for searching for the calss by its name
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
//this function creates a json element and returns it from the picked courses
function returnJSON() {
	let jsonfile = []
	let tmp;
	for (var i = 0; i < addedcourses.length; i++) {
		// tmp = {"name" : addedcourses[i],
		// 	   "title" : addedcoursestitles[i]};
		tmp = [courses['classes'][addedcoursesindex[i]][0].id,addedcoursestitles[i]];
		jsonfile.push(tmp);
		// jsonfile.push(courses['classes'][addedcoursesindex[i]][0].id);
		// jsonfile.push(addedcoursestitles[i]);
	}	
	return jsonfile;
}	


//on  pressing submit button, the json file creates for the calendar section
$(".submit").click(function() {
	outputjson = returnJSON();
	console.log(outputjson);

});
