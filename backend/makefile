FOLDER_JSON = json_files/
CALENDAR_JSON = ${FOLDER_JSON}calendar.json
COURSES_JSON = ${FOLDER_JSON}courses.json

FOLDER_EXCEL = excel_files/
CALENDAR_EXCEL = ${FOLDER_EXCEL}calendar.xlsx
COURSES_EXCEL = ${FOLDER_EXCEL}courses.xlsx

FOLDER_PY = py_files/

all: parse files_json
	python3 ${FOLDER_PY}create_json_calendar.py 

parse:
	python3 ${FOLDER_PY}parsing.py

files_json: parse
	python3 ${FOLDER_PY}html_to_json.py

courses_excel: files_json
	python3 ${FOLDER_PY}to_excel.py ${COURSES_JSON} ${COURSES_EXCEL}

calendar_json: files_json
	python3 ${FOLDER_PY}create_json_calendar.py 

calendar_excel: calendar_json
	python3 ${FOLDER_PY}to_excel.py ${CALENDAR_JSON} ${CALENDAR_EXCEL}

only_files_json:
	python3 ${FOLDER_PY}html_to_json.py

only_courses_excel:
	python3 ${FOLDER_PY}to_excel.py ${COURSES_JSON} ${COURSES_EXCEL}


	python3 ${FOLDER_PY}create_json_calendar.py 

only_calendar_excel:
	python3 ${FOLDER_PY}to_excel.py ${CALENDAR_JSON} ${CALENDAR_EXCEL}

clean:
	rm -rf __pycache__

.PHONY: run clean