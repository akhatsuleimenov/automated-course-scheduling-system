FOLDER_JSON = json_files/
CALENDAR_JSON = ${FOLDER_JSON}calendar.json
COURSES_JSON = ${FOLDER_JSON}courses.json

FOLDER_EXCEL = excel_files/
CALENDAR_EXCEL = ${FOLDER_EXCEL}calendar.xlsx
COURSES_EXCEL = ${FOLDER_EXCEL}courses.xlsx

parse:
	python3 parsing.py

json_files: parse
	python3 html_to_json.py

courses_excel: json_files
	python3 to_excel.py ${COURSES_JSON} ${COURSES_EXCEL}

json_calendar: json_files
	python3 create_json_calendar.py 

calendar_excel: json_calendar
	python3 to_excel.py ${CALENDAR_JSON} ${CALENDAR_EXCEL}

only_json_files:
	python3 html_to_json.py

only_courses_excel:
	python3 to_excel.py ${COURSES_JSON} ${COURSES_EXCEL}

only_json_calendar:
	python3 create_json_calendar.py 

only_calendar_excel:
	python3 to_excel.py ${CALENDAR_JSON} ${CALENDAR_EXCEL}
