CALENDAR_JSON = 'calendar.json'
COURSES_JSON = 'courses.json'

CALENDAR_EXCEL = 'calendar.xlsx'
COURSES_EXCEL = 'courses.xlsx'

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

