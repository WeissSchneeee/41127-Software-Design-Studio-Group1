from ast import Sub
from re import sub
from tokenize import group
from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
import psycopg2
import psycopg2.extras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

#used for reading data from database
# try:
#   conn = psycopg2.connect(
#     host="ec2-34-207-12-160.compute-1.amazonaws.com",
#     database="d5daga22vac1v1",
#     user="fkqtzcrjkybizb",
#     password="041098df80146c8615cd856429f37d05afe722c42b88f5b728f790f4c6462746")

#   cur = conn.cursor()

#   cur.execute('DROP TABLE IF EXISTS test_knn_subject')

#   create_script = ''' CREATE TABLE IF NOT EXISTS test_knn_subject (
#                       subject_id       varchar(10) PRIMARY KEY,
#                       subject_name     varchar(50) NOT NULL,
#                       quiz              int,
#                       individual_assign int,
#                       group_assign      int,
#                       exam              int,
#                       study_level       int 

#                   )'''

#   cur.execute(create_script)


#   insert_script = 'INSERT INTO test_knn_subject (subject_id, subject_name, quiz, individual_assign, group_assign, exam, study_level) VALUES (%s, %s, %s, %s, %s, %s, %s)'
#   insert_value = ['12345', 'Design_Studio', 0, 2, 2, 0, 5]


#   cur.execute(insert_script, insert_value)
#   conn.commit()

#   conn.close()
# except Exception as e:
#   print(e)


 # subjects in courseset: number of quiz, number of individual assignments, number of group assignments, has exam or not, study level(pre requisite), [similarity]

def splitSubjectNo(data):
  x = data.split(",")
  return x[0]

def splitTarget(data):
  x = data.split(",")
  x = float(x[9].strip())
  return int(x)

def splitCoreOrAlt(data):
  x = data.split(",")
  return int(x[8])

def splitPreR(data):
  x = data.split(",")
  return int(x[5])

def splitFeature(data):
  tmp = data.split(",")
  x = []
  x.append(int(tmp[1]))
  x.append(int(tmp[2]))
  x.append(int(tmp[3]))
  x.append(int(tmp[4]))
  x.append(int(tmp[5]))
  return x




# print(splitSubjectNo('41092,10,2,9,4,6,8.5\n'))

trainingDataSet = open("tran.txt", "r")
# print(trainingDataSet.read())

rowTrainDataList = []
for data in trainingDataSet:
  rowTrainDataList.append(data)
# print(rowTrainDataList)

print("Do you want to enroll in a core subject or not?(y/n)")
answer = input()

if(answer == 'y'):
  for data in reversed(rowTrainDataList):
    if(splitCoreOrAlt(data) == 0):
      rowTrainDataList.pop(rowTrainDataList.index(data))
elif(answer == 'n'):
  for data in reversed(rowTrainDataList):
    if(splitCoreOrAlt(data) == 100):
      rowTrainDataList.pop(rowTrainDataList.index(data))    


# print("How many pre quiesite subjects do you want for the subect you picked")
# answer = int(input())
# for data in reversed(rowTrainDataList):
#     if(splitPreR(data) != answer):
#       rowTrainDataList.pop(rowTrainDataList.index(data))

print(rowTrainDataList)

subjectNO = []
targetY = []
for data in rowTrainDataList:
  subjectNO.append(splitSubjectNo(data))
# print(subjectNO)

for data in rowTrainDataList:
  targetY.append(splitTarget(data))
# print(targetY)

featureX = []
for data in rowTrainDataList:
  featureX.append(splitFeature(data))
# print(featureX)

x = featureX
y = targetY

print(x)
print(y)
# basic handle
x_train, x_test, y_train, y_test = train_test_split(x,y,random_state=22,test_size=0.7)

print(x)
print(y)

#feature enginneering
transfer = StandardScaler()
# fit_transform function
x_train = transfer.fit_transform(x_train)
x_test = transfer.fit_transform(x_test)


es = KNeighborsClassifier(n_neighbors=5, algorithm="kd_tree")
es.fit(x_train, y_train)

y_pre = es.predict(x_test)
print("prediction value:\n", y_pre)
print("right or not:\n", y_pre == y_test)

ret = es.score(x_test, y_test)
print("accuracy:\n", ret)

estimator = KNeighborsClassifier(n_neighbors=5, algorithm="kd_tree")

estimator.fit(x,y)

predictor = []

print("The number of quiz you want: ")
predictor.append(int(input()))

print("The number of individual assignment you want: ")
predictor.append(int(input()))

print("The number of group assignment you want: ")
predictor.append(int(input()))

print("The number of exam you want: ")
predictor.append(int(input()))

print("The number of pre requisite you want: ")
predictor.append(int(input()))

# print("Pick your preference: ")
# predictor.append(int(input()))

print(predictor)

result = estimator.predict([predictor])

print(result)

subjectNoWithSimilarity = [[]]
subjectNOWithSimi = [subjectNO, targetY]
for data in subjectNOWithSimi:
  subjectNoWithSimilarity.append(data)
print(subjectNOWithSimi)



# subjectCategory = []

# for data in subjectNoWithSimilarity:
#   print(data)

# print(subjectCategory)
# # e.g,
# # x = [[3, 1, 0, 0, 0],[5, 2, 0, 0, 0],[0, 0, 3, 0, 1],[0, 0, 2, 0, 1],[2, 1, 1, 1, 3], [3, 1, 2, 1, 3]]
# # y = [0, 0, 1, 1, 2, 2]

# estimator = KNeighborsClassifier(n_neighbors=3) #k = 3

# estimator.fit(x, y)

# #predict a similarity level 

# ret = estimator.predict([[2, 2, 0, 0, 0]]) # First, students input their prefered subject feature

# print(ret)

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