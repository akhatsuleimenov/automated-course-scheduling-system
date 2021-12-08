import ast
import constants
import course_class
import json
from bs4 import BeautifulSoup as bs
from collections import defaultdict

ID_DICT = defaultdict(list)
COURSES = []
SUBCLASSES = []

def html_to_soup(html_file, mode):
    '''Convert the parsed file into the soup lists.'''
    html = open(html_file, mode).read()
    soup = bs(html, 'lxml')
    raw_courses = soup.find_all('div', class_='section-content')
    raw_names = soup.find_all('div', class_='secondary-head class-title-header')
    return (raw_courses, raw_names)

def list_class_sublists(raw_courses, raw_names):
    '''
    Create a list of lists where each list will hold all the courses with the same ids.
    Needed for the main page to display a course with all its seminars/labs/workshops and etc.
    '''
    index = 0
    for raw_name in raw_names:
        subclass = []
        for i in range(index, len(raw_courses)):
            if raw_name.get('id') != raw_courses[i]['data-classid']:
                index = i # Change index to the current number of course so that the same course does not appear in several lists.
                break
            raw_course = raw_courses[i]

            # Taking out only neccessary information from data parsed.
            w = 0 if raw_course['data-enrl_stat'] == 'W' else 1
            section_body = raw_course.find_all('div', class_= 'section-body')
            instructor = section_body[-3 + w].contents[0][12:]
            status = section_body[-2 + w].contents[0][8:]
            waitlist_count = 0 if w else section_body[-1].contents[0][-2:].strip()
            
            subclass.append(course_class.Course(raw_name.contents[0], section_body[0].contents[0][9:].strip(), raw_course['data-classid'], raw_course['data-term'], raw_course['data-campus'], ast.literal_eval(raw_course['data-days']), float(raw_course['data-start']), float(raw_course['data-end']), raw_course['data-instruct_mode'], instructor, status, waitlist_count, raw_course['data-session']))
        SUBCLASSES.append(subclass[:])

def equalize_lists(raw_courses, raw_names):
    ''' 
    Equalize two list. One of them holds the name of the courses.
    Another one holds all the neccessary information.
    '''
    for i in range(len(raw_courses)):
        if i == len(raw_names):
            raw_names.append(raw_names[len(raw_names) - 1])
        elif raw_courses[i]['data-classid'] != raw_names[i]['id']:
            raw_names.insert(i, raw_names[i - 1])

def soup_to_class(raw_courses, raw_names):
    '''
        Convert the soup element into a list of classes.
        Also, create a dictionay of classes where key is id
        and elements are courses with the same id.
    '''
    for raw_name,raw_course in zip(raw_names, raw_courses):
        section_body = raw_course.find_all('div', class_= 'section-body')
        COURSES.append(course_class.Course(raw_name.contents[0], section_body[0].contents[0][9:].strip(), raw_course['data-classid'], raw_course['data-term'], raw_course['data-campus'], ast.literal_eval(raw_course['data-days']), float(raw_course['data-start']), float(raw_course['data-end']), raw_course['data-instruct_mode'], section_body[4].contents[0][12:], section_body[5].contents[0][8:], 0 if section_body[5].contents[0][8:] != 'Wait List' else section_body[6].contents[0][-2:].strip(), raw_course['data-session']))
        if raw_course['data-classid'] not in ID_DICT:
            ID_DICT[raw_course['data-classid']] = [COURSES[-1]]
        else:
            ID_DICT[raw_course['data-classid']].append(COURSES[-1])

def sort_dict():
    '''Sort the dictionary by its status. Open first, everything else later.'''
    for key in ID_DICT:
        start = 0
        for i, course in enumerate(ID_DICT[key]):
            if course.status == 'Open':
                ID_DICT[key][i], ID_DICT[key][start] = ID_DICT[key][start], ID_DICT[key][i]
                start += 1

def to_json(json_file, mode, array):
    '''Convert list/dictionary into the json file.'''
    jsonstr = json.dumps(array, default = lambda x: x.__dict__)
    json_file = open(json_file, mode)
    json_file.write(jsonstr)
    json_file.close()

if __name__ == '__main__':
    raw_courses, raw_names = html_to_soup(constants.COURSES_HTML, 'r')

    list_class_sublists(raw_courses, raw_names)
    equalize_lists(raw_courses, raw_names)
    soup_to_class(raw_courses, raw_names)
    
    sort_dict()
    
    # Create json files for front end to display the course to the users.
    to_json(constants.COURSES_JSON, 'w', COURSES)
    to_json(constants.COURSES_DICT_JSON, 'w', ID_DICT)
    to_json(constants.SUBCLASSES_JSON, 'w', SUBCLASSES)