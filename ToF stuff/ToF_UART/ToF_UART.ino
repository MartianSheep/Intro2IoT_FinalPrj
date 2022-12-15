#include <SoftwareSerial.h>

#define RxPin 10
#define TxPin 11
static SoftwareSerial tofSerial(RxPin, TxPin);
volatile int rangeStatus;

#define TOFM_CMD_ST_MM 0x81

void sendSerial(unsigned char data) {
  tofSerial.write(data);
}

// Helper function to read data from software serial port.
int readSerial() {
  while (!tofSerial.available()) {}
  return tofSerial.read();
}

int Ranging() {
  sendSerial(0x55);
  sendSerial(0xAA);
  sendSerial(TOFM_CMD_ST_MM);
  sendSerial(0x00);
  sendSerial(0xFA);

  if(readSerial() != 0x55) return;
  if(readSerial() != 0xAA) return;
  if(readSerial() != TOFM_CMD_ST_MM) return;
  if(readSerial() != 0x03) return;
  int distHi = readSerial();
  int distLo = readSerial();
  rangeStatus = readSerial();
  if(readSerial() != 0xFA) return;

  return distHi * 256 + distLo;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  tofSerial.begin(9600);

  Serial.println("Start");
}

void loop() {
  // put your main code here, to run repeatedly:
  // Just a test
  Serial.println(Ranging());
  delay(100);
}
