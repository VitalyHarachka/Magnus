import cv2 as cv
import os
import datetime
import pysftp
import sys
import time

# Defines the name of the file for download / upload
srv = pysftp.Connection(host="134.209.27.142", username="root",
private_key='/home/jordan/.ssh/id_rsa')

# Closes the connection

cam1 = cv.VideoCapture(0)

while True:
	frame = cam1.read()[1]
	cv.imshow("Frame",frame)
	temp = 'Monitor/%s.jpg'%(str(datetime.datetime.now())) 
	cv.imwrite(temp ,frame)
	try:
		srv.put(temp,'/home/BigBrother/BigBrother/'+temp)
	except:
		pass
	os.remove(temp)
	if cv.waitKey(1) & 0xFF == ord('q'):
			break
	time.sleep(1)
srv.close()
