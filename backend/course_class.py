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

    # for debuggin/printing
    def __str__(self):
        return "Name:\t\t {}\nTitle:\t\t {}\nID:\t\t {}\nTerm:\t\t {}\nCampus:\t\t {}\nDays:\t\t {}\nStart_date:\t {}\nEnd_date:\t {}\nInstructor_mode: {}\nInstructor:\t {}\nStatus:\t\t {}\nWaitlist Count:  {}\nSession:\t {}\n".format(self.name, self.title, self.id, self.term, self.campus, self.days, self.start_date, self.end_date, self.inscturct_mode, self. instructor, self.status, self.waitlist_count, self.session)