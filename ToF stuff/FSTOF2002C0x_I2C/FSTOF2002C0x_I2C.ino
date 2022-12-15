#include <Wire.h>

#define SLAVE_ADDRESS 0x36
#define SERIAL_BAUD 9600


int SendData, DATA_SIZE, error;
int ranging_mm = 0;

void setup()
{
  Wire.begin();

  Serial.begin(SERIAL_BAUD);
//  Serial.print("Send ToF Module command, a: do ranging; b: get factory data; c: get module information;");
  Serial.println();

}

void loop()
{
  Do_Ranging();
  //  if (Serial.available())
  //  {
  //    int command_get = 0;
  //    command_get = Serial.read();
  //    Serial.print("command_get =  "); Serial.println(command_get, HEX);
  //
  //    //  switch(command_get) {
  //    //    case 'a':
  //    //        Do_Ranging();
  //    //        break;
  //    //    case 'b':
  //    //        Get_FactoryData();
  //    //        break;
  //    //    case 'c':
  //    //        Get_ModuleInfo();
  //    //        break;
  //    //    default:
  //    //        Serial.print("command unkown@@ ");
  //    //        break;
  //    //  }
  //
  //
  //
  //    while (Serial.available()) Serial.read(); // Clear the serial buffer
  //
  //  }

}
void Get_FactoryData()
{
  Serial.print("enter Get_ModuleInfo ");
  SendData = 0x85;
  DATA_SIZE = 9;
  Wire.beginTransmission(SLAVE_ADDRESS);
  Wire.write(SendData);
  Wire.write(DATA_SIZE); // Data Length is must!!
  Wire.endTransmission(0);  // Send a START Sign
  Wire.requestFrom(SLAVE_ADDRESS, DATA_SIZE);
  if (Wire.available()) {
    Serial.println("command 0x86 returned: ");
    int i = 0, data_temp[3] = {0};
    while (Wire.available())
    {
      data_temp[i] = Wire.read();
      Serial.println( data_temp[i] , HEX);
      i++;
    }
  }

}

void Get_ModuleInfo()
{
  Serial.print("enter Get_ModuleInfo ");
  SendData = 0x86;
  DATA_SIZE = 5;
  Wire.beginTransmission(SLAVE_ADDRESS);
  Wire.write(SendData);
  Wire.write(DATA_SIZE); // Data Length is must!!
  Wire.endTransmission(0);  // Send a START Sign
  Wire.requestFrom(SLAVE_ADDRESS, DATA_SIZE);
  if (Wire.available()) {
    Serial.println("command 0x86 returned: ");
    int i = 0, data_temp[3] = {0};
    while (Wire.available())
    {
      data_temp[i] = Wire.read();
      Serial.println( data_temp[i] , HEX);
      i++;
    }
  }
}
void Do_Ranging()
{
  SendData = 0x81;
  DATA_SIZE = 5;
  Wire.beginTransmission(SLAVE_ADDRESS);
  Wire.write(SendData);
  //delay(1);
  error = Wire.endTransmission(!0);
//  Serial.print("returned error: "); Serial.println( error, HEX);
  delay(30);//ranging processing wait


  Wire.beginTransmission(SLAVE_ADDRESS);
  Wire.write(SendData);
  Wire.write(DATA_SIZE); // Data Length is must!!
  Wire.endTransmission(0);  // Send a START Sign

  Wire.requestFrom(SLAVE_ADDRESS, DATA_SIZE);
  //Wire.requestFrom(SLAVE_ADDRESS, 1, true);    //address, quantity, stop
  if (Wire.available()) {
//    Serial.println("command 0x81 returned: ");
    int i = 0, data_temp[5] = {0};
    while (Wire.available())
    {
      data_temp[i] = Wire.read();
//      Serial.println( data_temp[i] , HEX);
      i++;
    }
//    Serial.println("Data end ");
    if ((data_temp[0] == 0x81) && ((data_temp[1] == 0x03)))
    {
      ranging_mm = (data_temp[2] << 8) + data_temp[3];
      Serial.print( "Ranging(mm) = ");
      Serial.println( ranging_mm , DEC);
    }
    else
    {
      Serial.println( "Get data error!!");
    }


  }
}
uint8_t ToF_0203_I2C_Read(uint8_t reg)
{
  uint8_t chr = 0;
  Wire.beginTransmission(SLAVE_ADDRESS);  //device address
  Wire.write(reg);  // read register
  Wire.endTransmission(false);
  Wire.requestFrom(SLAVE_ADDRESS, 1, true);    //address, quantity, stop
  if (Wire.available()) {
    chr = Wire.read();           //data
  }
  return  chr ;
}

uint8_t ToF_0203_I2C_Write(uint8_t reg, uint8_t data)
{
  Wire.beginTransmission(SLAVE_ADDRESS);           //device address
  Wire.write(reg);                                        // REG
  Wire.write(data);                                       // DATA
  Wire.endTransmission(true); // generate stop condition  // STOP

}
