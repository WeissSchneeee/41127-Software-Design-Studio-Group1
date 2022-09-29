import requests
from bs4 import BeautifulSoup, NavigableString, Tag
import mysql.connector


# print(soup.find_all('table')[2].find('a').next_element)

def has_colspan(tag):
    return tag.has_attr('colspan')

def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)

if __name__ == '__main__':
    db = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        database='course'
    )
    print(db)
    cursor = db.cursor()
    soup = BeautifulSoup(requests.get("https://handbook.uts.edu.au/courses/c10148.html").text, "html.parser")
    soup.prettify(formatter=lambda s: s.replace(u'\xa0', ' '))
    year = ''
    for child in soup.find_all('table')[2]:
        course_name = ''
        credit_points = ''
        if(child.find('td') != -1):
            if(child.find('td').has_attr('colspan')):
                if child.find('td').text.find('Year') != -1:
                    year = child.find('td').text
            else:
                if (child.find('td').find('a') != None):
                    course_name = child.find('td').find('a').next_sibling
                    credit_points = child.find('td').find('a').next_element.next_element.next_element.next_element.next_element.get_text()
                    print(credit_points)
                    if has_numbers(credit_points) == False:
                        credit_points = child.find('td').find('a').previous_element.next_sibling.next_sibling.next_sibling.next_sibling.text
            if (course_name != ''):
                print(course_name+' - '+year+' - '+credit_points)
                sql = "INSERT INTO course(course_id, course_name, course_duration, credit_points, course_fees, course_year) VALUES (0, %s, null, %s, null, %s)"
                val = (str(course_name), str(credit_points), str(year))
                cursor.execute(sql, val)

                db.commit()
            print('--------------------------------------------------------------------')