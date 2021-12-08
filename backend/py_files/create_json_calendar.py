import json
import constants
import course_class

def saving_json(json_file, mode):
    try:
        f = open(json_file, mode)
        try:
            id_dict = json.load(f)
        except:
            print('{} is empty'.format(json_file))
            return False
        f.close()
        return id_dict
    except IOError:
        print('{} does not exsit'.format(json_file))
        return False



def trim_tittle(title):
    title = title[:len(title) - 7].strip()
    title = title[5:] if title[0] == '-' else title[4:]
    if title[0] == '-':
        title = title[1:]
    return title

def modify_selected_courses(selected_courses, index):
    for i in range(len(selected_courses)):
        selected_courses[i] = (selected_courses[i], 'LEC')
    for i in range(len(selected_courses)):
        id_ = selected_courses[i][0]['id'] if i < index else selected_courses[i][0]
        try:
            for course in id_dict[id_]:
                if trim_tittle(course['title']) in constants.EXTRA:
                    selected_courses.append((course['id'], 'RCT'))
                    break
        except KeyError:
            print('{} does not exist.'.format(id_))
            return False
    return True

def scheduling(selected_courses, index):
    schedule = []
    if index:
        for i in range(index):
            schedule.append(selected_courses[i][0])
    calendar = backtracking([], schedule, selected_courses, index)
    return calendar

def backtracking(calendar, schedule, selected_courses, index):
    if index == len(selected_courses):
        calendar.append(schedule[:])
        return calendar

    # check if time with days are possible in the schedule
    for course in id_dict[selected_courses[index][0]]:
        try:
            selected_course = 1 if selected_courses[index][1] in constants.EXTRA else 0
            extra_course = 1 if trim_tittle(course['title']) in constants.EXTRA else 0
            if course['status'] == 'Closed' or not extra_course == selected_course:
                continue
            possible = True
            start, end = course['start_date'], course['end_date']
            days = set(course['days'])
            for selected_course in schedule:
                try:
                    days_intersection = days.intersection(selected_course['days'])
                    added_start, added_end = selected_course['start_date'], selected_course['end_date']
                    for day in days_intersection:
                        if not (added_start > end or added_end < start):
                            possible = False
                            break
                    if not possible:
                        break
                except:
                    print('{} has some error in the structure'.format(selected_course['name']))
                    possible = False
            if possible:
                schedule.append(course)
                backtracking(calendar, schedule, selected_courses, index + 1)
                schedule.pop()
        except:
            print('{} has some error in the structure'.format(course['name']))
    return calendar

def check_fixed_courses(fixed_courses):
    for i in range(len(fixed_courses)):
        start, end = fixed_courses[i]['start_date'], fixed_courses[i]['end_date']
        for j in range(i + 1, len(fixed_courses)):
            days_intersection = set(fixed_courses[i]['days']).intersection(fixed_courses[j]['days'])
            added_start, added_end = fixed_courses[j]['start_date'], fixed_courses[j]['end_date']
            for day in days_intersection:
                if not (added_start > end or added_end < start):
                    return False
    return True

def correct_selected_courses(selected_courses):
    selected_count = 0
    fixed_selected_courses = []
    try:
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
    except:
        print('{} has wrong format'.format(constants.SELECTED_JSON))
        return (False, False)

def to_json(json_file, mode, array):
    jsonstr = json.dumps(array, default = lambda x: x.__dict__)
    json_file = open(json_file, mode)
    json_file.write(jsonstr)
    json_file.close()

if __name__ == '__main__':
    id_dict = saving_json(constants.COURSES_DICT_JSON, 'r')
    selected_courses = saving_json(constants.SELECTED_JSON, 'r')
    if selected_courses and id_dict:
        fixed_selected_courses, selected_count = correct_selected_courses(selected_courses)
        if fixed_selected_courses:
            if check_fixed_courses(fixed_selected_courses[:selected_count]):
                if modify_selected_courses(fixed_selected_courses, selected_count):
                    calendar = scheduling(fixed_selected_courses, selected_count)
                    to_json(constants.CALENDAR_JSON, 'w', calendar)
            else:
                to_json(constants.CALENDAR_JSON, 'w', [])