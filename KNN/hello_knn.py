from re import sub
from sklearn.neighbors import KNeighborsClassifier
import psycopg2
import psycopg2.extras


try:
  conn = psycopg2.connect(
    host="ec2-34-207-12-160.compute-1.amazonaws.com",
    database="d5daga22vac1v1",
    user="fkqtzcrjkybizb",
    password="041098df80146c8615cd856429f37d05afe722c42b88f5b728f790f4c6462746")

  cur = conn.cursor()

  cur.execute('DROP TABLE IF EXISTS test_knn_subject')

  create_script = ''' CREATE TABLE IF NOT EXISTS test_knn_subject (
                      subject_id       varchar(10) PRIMARY KEY,
                      subject_name     varchar(50) NOT NULL,
                      quiz              int,
                      individual_assign int,
                      group_assign      int,
                      exam              int,
                      study_level       int 

                  )'''

  cur.execute(create_script)


  insert_script = 'INSERT INTO test_knn_subject (subject_id, subject_name, quiz, individual_assign, group_assign, exam, study_level) VALUES (%s, %s, %s, %s, %s, %s, %s)'
  insert_value = ['12345', 'Design_Studio', 0, 2, 2, 0, 5]


  cur.execute(insert_script, insert_value)
  conn.commit()

  conn.close()
except Exception as e:
  print(e)


 # subjects in courseset: number of quiz, number of individual assignments, number of group assignments, has exam or not, study level(pre requisite), [similarity]



x = [[3, 1, 0, 0, 0],[5, 2, 0, 0, 0],[0, 0, 3, 0, 1],[0, 0, 2, 0, 1],[2, 1, 1, 1, 3], [3, 1, 2, 1, 3]]
y = [0, 0, 1, 1, 2, 2]

estimator = KNeighborsClassifier(n_neighbors=3) #k = 3

estimator.fit(x, y)

#predict a similarity level 

ret = estimator.predict([[2, 2, 0, 0, 0]]) # First, students input their prefered subject feature

print(ret)

#find the subjects that falls into this similarity
#subjectset.find()...


#subjectlist: 332456, 123456, 654124, 756897....

#Firstly, find those who did the subjects in the list before
#do KNN based on the founded sutdents' dataset

#student: major, preference_1 level, ......, preference_5 level, [target course]

student = [[1, 0, 0, 0, 0, 5], [1, 0, 0, 0, 0, 4], [1, 1, 3, 0, 0, 3], [2, 0, 2, 0, 1, 2], [2, 1, 2, 3, 4, 5], [2, 4, 2, 3, 1, 1]]
subject = [332456, 332456, 13456, 123456, 654124, 756897]

est2 = KNeighborsClassifier(n_neighbors= 3) # k = 3
est2.fit(student, subject)

ret2 = est2.predict([[1, 1, 4, 0, 0, 1]])

print(ret2)





















# Result file I/O
#with open('output.txt', 'w') as f:

 #   f.writelines(str(ret))

#f.close()

#with open('output.txt', 'r') as f:
 #   read_data = f.read()
  #  print(read_data)
#f.close()