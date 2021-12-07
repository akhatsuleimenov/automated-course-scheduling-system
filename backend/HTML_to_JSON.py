from bs4 import BeautifulSoup as bs
import json
import ast
from collections import defaultdict

id_dict = defaultdict(list)
courses = []
list_of_subclasses = []

class Course:
    def __init__(self, name, title, id, term, campus, days, start_date, end_date, inscturct_mode, instructor, status, waitlist_count, session):
        self.name = name
        self.title = title
        self.id = id
        self.term = term
        self.campus = campus
        self.days = days
        self.start_date = start_date
        self.end_date = end_date
        self.inscturct_mode = inscturct_mode
        self.instructor = instructor
        self.status = status
        self.waitlist_count = waitlist_count
        self.session = session

    def __str__(self):
        return "Name:\t\t {}\nTitle:\t\t {}\nID:\t\t {}\nTerm:\t\t {}\nCampus:\t\t {}\nDays:\t\t {}\nStart_date:\t {}\nEnd_date:\t {}\nInstructor_mode: {}\nInstructor:\t {}\nStatus:\t\t {}\nWaitlist Count:  {}\nSession:\t {}\n".format(self.name, self.title, self.id, self.term, self.campus, self.days, self.start_date, self.end_date, self.inscturct_mode, self. instructor, self.status, self.waitlist_count, self.session)


def HTMLToSoup(htmlFile, mode):
    html = open(htmlFile, mode).read()
    soup = bs(html, 'lxml')
    raw_courses = soup.find_all('div', class_='section-content')
    raw_names = soup.find_all('div', class_='secondary-head class-title-header')
    return (raw_courses, raw_names)

def listClassSublists(raw_courses, raw_names):
    index = 0
    for raw_name in raw_names:
        subclass = []
        for i in range(index, len(raw_courses)):
            if raw_name.get('id') != raw_courses[i]['data-classid']:
                index = i
                break
            raw_course = raw_courses[i]
            w = 0 if raw_course['data-enrl_stat'] == 'W' else 1
            section_body = raw_course.find_all('div', class_= 'section-body')
            instructor = section_body[-3 + w].contents[0][12:]
            status = section_body[-2 + w].contents[0][8:]
            waitlist_count = 0 if w else section_body[-1].contents[0][-2:].strip()
            subclass.append(Course(raw_name.contents[0], section_body[0].contents[0][9:].strip(), raw_course['data-classid'], raw_course['data-term'], raw_course['data-campus'], ast.literal_eval(raw_course['data-days']), float(raw_course['data-start']), float(raw_course['data-end']), raw_course['data-instruct_mode'], instructor, status, waitlist_count, raw_course['data-session']))
        list_of_subclasses.append(subclass[:])

def equalizeLists(raw_courses, raw_names):
    for i in range(len(raw_courses)):
        if i == len(raw_names):
            raw_names.append(raw_names[len(raw_names) - 1])
        elif raw_courses[i]['data-classid'] != raw_names[i]['id']:
            raw_names.insert(i, raw_names[i - 1])

def soupToClass(raw_courses, raw_names):
    for raw_name,raw_course in zip(raw_names, raw_courses):
        section_body = raw_course.find_all('div', class_= 'section-body')
        courses.append(Course(raw_name.contents[0], section_body[0].contents[0][9:].strip(), raw_course['data-classid'], raw_course['data-term'], raw_course['data-campus'], ast.literal_eval(raw_course['data-days']), float(raw_course['data-start']), float(raw_course['data-end']), raw_course['data-instruct_mode'], section_body[4].contents[0][12:], section_body[5].contents[0][8:], 0 if section_body[5].contents[0][8:] != 'Wait List' else section_body[6].contents[0][-2:].strip(), raw_course['data-session']))
        if raw_course['data-classid'] not in id_dict:
            id_dict[raw_course['data-classid']] = [courses[-1]]
        else:
            id_dict[raw_course['data-classid']].append(courses[-1])

def sortDict():
    for key in id_dict:
        start = 0
        for i, course in enumerate(id_dict[key]):
            if course.status == 'Open':
                id_dict[key][i], id_dict[key][start] = id_dict[key][start], id_dict[key][i]
                start += 1

def toJSON(jsonFile, mode, array):
    jsonstr = json.dumps(array, default = lambda x: x.__dict__)
    jsonFile = open(jsonFile, mode)
    jsonFile.write(jsonstr)
    jsonFile.close()


def main():
    htmlFile = 'data.html'
    arrayJSONFile = 'courses.json'
    dictJSONFile = 'dict.json'
    subclassesJSONFile = 'subclasses.json'
    
    raw_courses, raw_names = HTMLToSoup(htmlFile, 'r')

    listClassSublists(raw_courses, raw_names)
    equalizeLists(raw_courses, raw_names)
    soupToClass(raw_courses, raw_names)
    
    sortDict()
    
    toJSON(subclassesJSONFile, 'w', list_of_subclasses)
    toJSON(arrayJSONFile, 'w', courses)
    toJSON(dictJSONFile, 'w', id_dict)

    ''' delete after Cheena does this'''
    selectedJSONFile = 'selected.json'
    selected_courses = [('MATHUH1000A234160', '001-SEM (18450)'), ('ARABLUH1120160332', 0), ('ARABLUH2120204522', 0), ('ARTHUH2128232572', 0), ('AWUH1118236369', 0)]
    toJSON(selectedJSONFile, 'w', selected_courses)
    ''' delete after Cheena does this'''

if __name__ == '__main__':
    main()