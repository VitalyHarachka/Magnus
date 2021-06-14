import cv2 as cv
import os
import datetime
import pysftp
import sys

# Defines the name of the file for download / upload
srv = pysftp.Connection(host="134.209.27.142", username="root",
private_key='/home/jordan/.ssh/id_rsa')

# Closes the connection
user = "n0732961"
cam1 = cv.VideoCapture(0)

while True:
	frame = cam1.read()[1]
	cv.imshow("Frame",frame)
	temp = user + str(datetime.datetime.now()) + '.jpg' 
	cv.imwrite(temp ,frame)
	try:
		srv.put(temp,'/home/BigBrother/BigBrother/toAdd/'+temp)
		print '/home/BigBrother/BigBrother/toAdd/'+temp
	except:
		pass
	os.remove(temp)
	if cv.waitKey(1) & 0xFF == ord('q'):
			break
srv.close()