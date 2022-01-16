import serial
import time
import mysql.connector
import keyboard
from datetime import datetime


# set up the serial line
ser = serial.Serial('/dev/cu.usbmodem141202', 9600)
time.sleep(2)

mydb = mysql.connector.connect(
  host="us-cdbr-east-05.cleardb.net",
  user="b4fa7f2c252de3",
  password="80e89902",
  database="heroku_185e07c9411031b"
)

mycursor = mydb.cursor()
flt = 0

while True:
  # process the weight information
  b = ser.readline()         # read a byte string
  string_n = b.decode()  # decode byte string into Unicode  
  string = string_n.rstrip() # remove \n and \r
  curr_flt = float(string)        # convert string to float

  if (curr_flt - flt > 0.02 or (flt - curr_flt > 0.02)):

    if (curr_flt - flt > 0.02):
      time.sleep(7)
      b = ser.readline()         # read a byte string
      string_n = b.decode()  # decode byte string into Unicode  
      string = string_n.rstrip() # remove \n and \r
      curr_flt = float(string)        # convert string to float
      
    flt = curr_flt
    weight = int((flt - 0.377) * 453.592)
    # process the datetime information
    now = datetime.now()
    dt_str = now.strftime("%Y-%m-%d %H:%M:%S")

    # query current weight and datetime
    sql = "INSERT INTO weights (time, food_weight) VALUES (%s, %s)"
    val = (dt_str, weight)
    mycursor.execute(sql, val)


    # commit to DB
    mydb.commit()

    # print if successful
    print(mycursor.rowcount, "record inserted.")
  

  time.sleep(0.1)            # wait (sleep) 0.1 seconds

  # terminate when space is pressed
  if keyboard.is_pressed(' '):
    print('Terminate uploading')
    break

# close serial reader
ser.close()
