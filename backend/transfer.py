from ast import Sub
from re import sub
from tokenize import group
from numpy import append, true_divide
from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
import psycopg2
import psycopg2.extras
import os
import sys
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler



#input data to database
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

cwd = os.getcwd()
files = os.listdir(cwd)
print("Files in %r: %s" % (cwd, files))
trainingDataSet = open("tran.txt", "r")
# print(trainingDataSet.read())

rowTrainDataList = []
for data in trainingDataSet:
  rowTrainDataList.append(data)
# print(rowTrainDataList)

subjectNO = []
for data in rowTrainDataList:
  subjectNO.append(splitSubjectNo(data))

featureX = []
for data in rowTrainDataList:
  featureX.append(splitFeature(data))

core = []
for data in rowTrainDataList:
    core.append(splitCoreOrAlt(data))

print(subjectNO)
print(featureX)
print(core)
#used for reading data from database
try:
  conn = psycopg2.connect(
    host="ec2-34-207-12-160.compute-1.amazonaws.com",
    database="d5daga22vac1v1",
    user="fkqtzcrjkybizb",
    password="041098df80146c8615cd856429f37d05afe722c42b88f5b728f790f4c6462746")

  cur = conn.cursor()

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

  for i in range(153):
        insert_script = 'INSERT INTO subject (subject_id, subject_name, pre_requisites, core_subjects, anti_requisites, co_requisites, scredit_points, subject_descriptions, subject_level, electives, subject_fees, subject_quiz, subject_indiassign, subject_groupassign, subject_exam, subject_preq) VALUES (%s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s)'
        insert_value = [subjectNO[i], 'Studio ' + str(i),'N/A',core[i],'N/A','N/A',6,'N/A','N/A','N/A', 1200, featureX[i][0], featureX[i][1], featureX[i][2], featureX[i][3], featureX[i][4]]


        cur.execute(insert_script, insert_value)
        conn.commit()

  conn.close()

except Exception as e:
  print(e)