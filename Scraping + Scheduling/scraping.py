from bs4 import BeautifulSoup as bs
import requests
from lxml import html
import json
import pandas as pd
import openpyxl
import ast

id_dict = {}
courses = []
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

def parseToHTML(htmlFile, mode):
    url = "https://m.albert.nyu.edu/app/catalog/getClassSearch"

    payload='CSRFToken=0cacdd6a262ee0c2540ca0f1d44089d2&acad_group=UH&catalog_nbr=&class_nbr=&keyword=&nyu_location=&subject=&term=1224'
    headers = {
      'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      'sec-ch-ua-platform': '"macOS"',
      'Cookie': 'ADRUM=s=1636870439764&r=https%3A%2F%2Fbrightspace.nyu.edu%2Fd2l%2Flms%2Fdropbox%2Fuser%2Ffolder_user_view_feedback.d2l%3F150855492; BIGipServer~SNS-LOW~prod-sis-pool=rd3133o00000000000000000000ffff0a2f060co8066; ExpirePage=https://sis.portal.nyu.edu/psp/ihprod/; HPTabName=IS_SSS_TAB; HPTabNameRemote=; LastActiveTab=IS_SSS_TAB; PHPSESSID=3mstcj041d770t3aof5f447t52; PS_DEVICEFEATURES=width:1440 height:900 pixelratio:2 touch:0 geolocation:1 websockets:1 webworkers:1 datepicker:1 dtpicker:1 timepicker:1 dnd:1 sessionstorage:1 localstorage:1 history:1 canvas:1 svg:1 postmessage:1 hc:0 maf:0; PS_LASTSITE=https://sis.portal.nyu.edu/psp/ihprod/; PS_LOGINLIST=https://sis.nyu.edu/csprod https://sis.portal.nyu.edu/ihprod; PS_TOKEN=pQAAAAQDAgEBAAAAvAIAAAAAAAAsAAAABABTaGRyAk4Abwg4AC4AMQAwABTTIyhuXc421buKdmehGQ5pbbYAJmUAAAAFAFNkYXRhWXicJYpLDkBAEAXLEEs3IWNGfJYW2Mkk7MUJLFzP4TyjX6q6k34XkKUmSbQfQ5zi5KbGM9Aq+cTKQhHYmNk5CIw0DotTrRS/vezkSli5jvf37ZVO8AKCVAt8; PS_TOKENEXPIRE=14_Nov_2021_0:18_GMT; PS_TokenSite=https://sis.portal.nyu.edu/psp/ihprod/?pco01lw-1556s-8051-PORTAL-PSJSESSIONID; SignOnDefault=; __utma=57748789.1922840866.1628059481.1634405387.1635238799.10; __utmz=57748789.1634405387.9.9.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _drip_client_6158192=vid%253D54db9895aa194ce784fc3ae4202d043c%2526pageViews%253D1%2526sessionPageCount%253D1%2526lastVisitedAt%253D392646895%2526weeklySessionCount%253D1%2526lastSessionAt%253D392646895; _fbp=fb.1.1628059634773.4892; _ga=GA1.2.1922840866.1628059481; _gid=GA1.2.1265445606.1636786654; _scid=71aa006a-23f4-42ea-890c-89907fa69fd4; _sctr=1|1635192000000; fpestid=S50C2-epUV24gCdlSadqrCOEpyczyqXcq5JUStKCxPPUNkP-2_ps6xbyuKkOfVNY6mLbdw; https%3a%2f%2fsis.portal.nyu.edu%2fpsp%2fihprod%2femployee%2fempl%2frefresh=list:%20%3Ftab%3Dremoteunifieddashboard%7C%3Frp%3Dremoteunifieddashboard%7C%7C%7C; lcsrftoken=hopTsZFqR3gKZ7dDdRhSzNX1Le2ImkVuOMdo+arSF7I=; nmstat=791ca8c8-78ab-1aed-df5c-5280f1b7d038; nyuad=eyJpdiI6InAwd0NwRlY2YjA3T01VYlN6VXRnN1E9PSIsInZhbHVlIjoiM1JHeWRxaEVjTW5XYW1jXC9BV2lQcUVGWHZhXC9DS2lIdHhSbnlnM1VwWnhPUjVsYzdXQVBmWUtLaTNoc1U0UTdhTFVEMittN3NnUGo5cHJHbzdBQW1tdz09IiwibWFjIjoiZWZmMDM4MzQ3MDZiZTQ1NGM2NjBkODZjNzBkYTNjZTQ1MTRkNTgwMTA4MDE1ZWI5YTdlN2YwYzJiODNjN2ZjMyJ9; pco01lw-1537s-8051-PORTAL-PSJSESSIONID=yAEdyHAO9VuqIwlgf9jAK87lXuRmxvEH!1483518525; pco01lw-1556s-8051-PORTAL-PSJSESSIONID=SM0dyGzyrYMhlq0-Q5RcjnLWMnP27kDu!-665168926; ps_theme=node:EMPL portal:EMPLOYEE theme_id:NYU_THEME accessibility:N formfactor:3 piamode:2; psback=%22%22url%22%3A%22https%3A%2F%2Fsis.portal.nyu.edu%2Fpsp%2Fihprod%2FEMPLOYEE%2FEMPL%2Fh%2F%3Ftab%3DIS_SSS_TAB%22%20%22label%22%3A%22LabelNotFound%22%20%22origin%22%3A%22PIA%22%20%22layout%22%3A%220%22%20%22refurl%22%3A%22https%3A%2F%2Fsis.portal.nyu.edu%2Fpsp%2Fihprod%2FEMPLOYEE%2FEMPL%2Fh%2F%3Ftab%3DIS_SSS_TAB%22%22; BIGipServer~SNS-LOW~prod-m-albert-pool=rd3133o00000000000000000000ffff0a2f060eo80; BIGipServer~SNS-LOW~prod-sis-portal-pool=rd3133o00000000000000000000ffff0a2f0614o8666; CSRFCookie=0cacdd6a262ee0c2540ca0f1d44089d2; _ga=GA1.4.1922840866.1628059481; _gid=GA1.4.1265445606.1636786654; highpoint_cs=rb7j695s1t5irkrqec3etmn3t2'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    htmlFile = open(htmlFile, mode)
    htmlFile.write(response.text)
    htmlFile.close()

def HTMLToSoup(htmlFile, mode):
    html = open(htmlFile, mode).read()
    soup = bs(html, 'lxml')
    raw_courses = soup.find_all('div', class_='section-content')
    raw_names = soup.find_all('div', class_='secondary-head class-title-header')
    return (raw_courses, raw_names)

def equalizeLists(raw_courses, raw_names):
    for i in range(len(raw_courses)):
        if i == len(raw_names):
            raw_names.append(raw_names[len(raw_names) - 1])
        elif raw_courses[i]['data-classid'] != raw_names[i]['id']:
            raw_names.insert(i, raw_names[i - 1])

def soupToClass(raw_courses, raw_names):
    for raw_name,raw_course in zip(raw_names, raw_courses):
        section_body = raw_course.find_all('div', class_= 'section-body')
        title = section_body[0].contents[0][9:len(section_body[0].contents[0]) - 7].strip()
        title = title[5:] if title[0] == '-' else title[4:]
        if title[0] == '-':
            title = title[1:]
        courses.append(Course(raw_name.contents[0], title, raw_course['data-classid'], raw_course['data-term'], raw_course['data-campus'], ast.literal_eval(raw_course['data-days']), float(raw_course['data-start']), float(raw_course['data-end']), raw_course['data-instruct_mode'], section_body[4].contents[0][12:], section_body[5].contents[0][8:], 0 if section_body[5].contents[0][8:] != 'Wait List' else section_body[6].contents[0][-2:].strip(), raw_course['data-session']))
        if raw_course['data-classid'] not in id_dict:
            id_dict[raw_course['data-classid']] = [courses[-1]]
        else:
            id_dict[raw_course['data-classid']].append(courses[-1])

def toJSON(jsonFile, mode):
    jsonstr = json.dumps(courses, default = lambda x: x.__dict__)
    jsonFile = open(jsonFile, mode)
    jsonFile.write(jsonstr)
    jsonFile.close()

def JSONToExcel(inFile, outFile):
    pd.read_json(inFile).to_excel(outFile)

def parsing():
    raw_courses, raw_names = [], []
    htmlFile = 'data.html'
    jsonFile = 'courses.json'
    excelFile = 'courses.xlsx'
    # parseToHTML(htmlFile, 'w')
    raw_courses, raw_names = HTMLToSoup(htmlFile, 'r')
    equalizeLists(raw_courses, raw_names)
    soupToClass(raw_courses, raw_names)
    toJSON(jsonFile, 'w')
    JSONToExcel(jsonFile, excelFile)

def savingHTMLtoList(jsonFile, mode):
    f = open(jsonFile, mode)
    data = json.load(f)
    f.close()
    return data

# def savingHTMLtoDict():
# def selectedCoursesFromHTML():

# def errorSelectedCourse(course, seen):
#     if course.status == 'C':
#         print("{course.name} is closed. You can't create a schedule with it.")
#         return False
#     if course.id in seen:
#         print("{course.name} is already picked. You can't pick more than one of the same course.")
#         return False
#     if course.status == 'W':
#         print("{course.name} is waitlisted. You are going to be {course.waitlist_count} in the queue. Be aware of that.")
#     return True

def modifySelectedCourses(selected_courses):
    for i in range(len(selected_courses)):
        selected_courses[i] = (selected_courses[i], 'LEC')
    for i in range(len(selected_courses)):
        for course in id_dict[selected_courses[i][0]]:
            if course.title in extra:
                selected_courses.append((course.id, course.title))
                break

def scheduling(selected_courses):
    schedule, messages = backtracking(set(), selected_courses, 0, [])
    if not schedule:
        print("No possible schedule")
        return
    print(*schedule, sep = '\n')
    print(*messages, sep = '\n')

def backtracking(schedule, selected_courses, index, messages):
    if index == len(selected_courses):
        return (schedule, messages)

    if selected_courses[index][1] == 'LEC':
        # check if time with days are possible in the schedule
        for course in id_dict[selected_courses[index][0]]:
            if course.status == 'Closed': # Front end should cover this part, delete later. Maybe?
                continue
            if course.title in extra:
                continue
            possible = True
            start, end = course.start_date, course.end_date
            days = set(course.days)
            for selected_course in schedule:
                days_intersection = days.intersection(selected_course.days)
                for day in days_intersection:
                    added_start, added_end = selected_course.start_date, selected_course.end_date
                    if not (added_start > end or added_end < start):
                        possible = False
                        break
                if not possible:
                    break
            if possible:
                schedule.add(course)
                if course.status == 'Wait List':
                    messages.append("{} is waitlisted. You are going to be number{} in the queue. Be aware of that.".format(course.name, course.waitlist_count))
                return backtracking(schedule, selected_courses, index + 1, messages)
                schedule.remove(course)
                if messages:
                    messages.pop()
    else:
        # check if time with days are possible in the schedule
        for course in id_dict[selected_courses[index][0]]:
            if course.status == 'Closed': # Front end should cover this part, delete later. Maybe?
                continue
            if course.title not in extra:
                continue
            possible = True
            start, end = course.start_date, course.end_date
            days = set(course.days)
            for selected_course in schedule:
                days_intersection = days.intersection(selected_course.days)
                for day in days_intersection:
                    added_start, added_end = selected_course.start_date, selected_course.end_date
                    if not (added_start > end or added_end < start):
                        possible = False
                        break
                if not possible:
                    break
            if possible:
                schedule.add(course)
                if course.status == 'Wait List':
                    messages.append("{} is waitlisted. You are going to be number{} in the queue. Be aware of that.".format(course.name, course.waitlist_count))
                return backtracking(schedule, selected_courses, index + 1, messages)
                schedule.remove(course)
                if messages:
                    messages.pop()
    return (False, [])
            

    
def main():
    parsing()
    data = savingHTMLtoList('courses.json', 'r')
    selected_courses = ['MATHUH1000A234160', 'ARABLUH1120160332', 'ARABLUH2120204522', 'ARTHUH2128232572', 'AWUH1118236369']
    modifySelectedCourses(selected_courses)
    print(selected_courses)
    scheduling(selected_courses)


if __name__ == '__main__':
    main()