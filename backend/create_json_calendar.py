import json
from collections import defaultdict

extra = {'LAB', 'RCT', 'WKS'}

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

def savingJSONtoDict(jsonFile, mode):
    f = open(jsonFile, mode)
    id_dict = json.load(f)
    f.close()
    return id_dict

def savingJSONtoList(jsonFile, mode):
    f = open(jsonFile, mode)
    data = json.load(f)
    f.close()
    return data

def trimTitle(title):
    title = title[:len(title) - 7].strip()
    title = title[5:] if title[0] == '-' else title[4:]
    if title[0] == '-':
        title = title[1:]
    return title

def modifySelectedCourses(selected_courses, index):
    for i in range(len(selected_courses)):
        selected_courses[i] = (selected_courses[i], 'LEC')
    for i in range(len(selected_courses)):
        id_ = selected_courses[i][0]['id'] if i < index else selected_courses[i][0]
        for course in id_dict[id_]:
            if trimTitle(course['title']) in extra:
                selected_courses.append((course['id'], 'RCT'))
                break

def scheduling(selected_courses, index):
    schedule = []
    if index:
        for i in range(index):
            schedule.append(selected_courses[i][0])
    calendar = backtracking([], schedule, selected_courses, index)
    ''' to be deleted '''
    if not calendar:
        print("No possible schedule")
        return
    # i = 0
    # for schedule, message in calendar:
    #     print("Calendar ", i)
    #     print(*schedule, message, sep='\n')
    #     i += 1
    ''' to be deleted '''
    return calendar

def backtracking(calendar, schedule, selected_courses, index):
    if index == len(selected_courses):
        calendar.append(schedule[:])
        return calendar

    # check if time with days are possible in the schedule
    for course in id_dict[selected_courses[index][0]]:
        selected_course = 1 if selected_courses[index][1] in extra else 0
        extra_course = 1 if trimTitle(course['title']) in extra else 0
        if course['status'] == 'Closed' or not extra_course == selected_course:
            continue
        possible = True
        start, end = course['start_date'], course['end_date']
        days = set(course['days'])
        for selected_course in schedule:
            days_intersection = days.intersection(selected_course['days'])
            added_start, added_end = selected_course['start_date'], selected_course['end_date']
            for day in days_intersection:
                if not (added_start > end or added_end < start):
                    possible = False
                    break
            if not possible:
                break
        if possible:
            schedule.append(course)
            backtracking(calendar, schedule, selected_courses, index + 1)
            schedule.pop()
    return calendar

def checkFixedCourses(fixed_courses):
    for i in range(len(fixed_courses) - 1):
        start, end = fixed_courses[i].start_date, fixed_courses[i].end_date
        for j in range(i + 1, len(fixed_courses)):
            days_intersection = set(fixed_courses[i].days).intersection(fixed_courses[j].days)
            added_start, added_end = fixed_courses[j].start_date, fixed_courses[j].end_date
            for day in days_intersection:
                if not (added_start > end or added_end < start):
                    return False
    return True

def correctSelectedCourses(selected_courses):
    selected_count = 0
    fixed_selected_courses = []
    for course_id, course_term in selected_courses:
        if not course_term:
            fixed_selected_courses.append(course_id)
        else:
            selected_count += 1
            for c in id_dict[course_id]:
                if c['title'] == course_term:
                    fixed_selected_courses.insert(0, c)
                    break
    return (fixed_selected_courses, selected_count)

def toJSON(jsonFile, mode, array):
    jsonstr = json.dumps(array, default = lambda x: x.__dict__)
    jsonFile = open(jsonFile, mode)
    jsonFile.write(jsonstr)
    jsonFile.close()

if __name__ == '__main__':
    id_dict = savingJSONtoDict('dict.json', 'r')
    selected_courses = savingJSONtoList("selected.json", 'r')

    fixed_selected_courses, selected_count = correctSelectedCourses(selected_courses)
    if checkFixedCourses(fixed_selected_courses[:selected_count]):
        
        modifySelectedCourses(fixed_selected_courses, selected_count)
        calendar = scheduling(fixed_selected_courses, selected_count)
        
        toJSON('calendar.json', 'w', calendar)
    else:
        toJSON('calendar.json', 'w', ["No possible schedule"])