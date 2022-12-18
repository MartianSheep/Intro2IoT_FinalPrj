#include <SPI.h>
#include <LoRa.h>
#include <HardwareSerial.h>
#include <driver/rtc_io.h>

#include <WiFi.h>
//#include <BluetoothSerial.h>
#include "driver/adc.h"
#include <esp_bt.h>

#include <ArduinoJson.h>

const int csPin = 5;
const int resetPin = 2;
const int irqPin = 4;
const int helpPin = 36;

uint8_t MAC[6] = {0};
String id = "";
const int capacity = JSON_OBJECT_SIZE(6) + JSON_ARRAY_SIZE(15);
StaticJsonDocument<capacity> doc;

HardwareSerial tofSerial(2);
#define TOFM_CMD_ST_MM 0x81
volatile int rangeStatus;

esp_sleep_wakeup_cause_t wakeup_reason;
uint64_t expectWakeupTime = 0;
uint64_t sleepTime = 10 * 1000000;
uint64_t awakeTime = 2 * 1000000;
uint64_t waitTime = 2 * 1000000;
bool getCallback = false;

void print_wakeup_reason(esp_sleep_wakeup_cause_t wakeup_reason){
  switch(wakeup_reason)
  {
    case ESP_SLEEP_WAKEUP_EXT0 : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case ESP_SLEEP_WAKEUP_EXT1 : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case ESP_SLEEP_WAKEUP_TIMER : Serial.println("Wakeup caused by timer"); break;
    case ESP_SLEEP_WAKEUP_TOUCHPAD : Serial.println("Wakeup caused by touchpad"); break;
    case ESP_SLEEP_WAKEUP_ULP : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.printf("Wakeup was not caused by deep sleep: %d\n",wakeup_reason); break;
  }
}

void sendSerial(unsigned char data) {
  tofSerial.write(data);
}

int readSerial() {
  while (!tofSerial.available()) {}
  return tofSerial.read();
}

int Ranging() {
  tofSerial.begin(9600, SERIAL_8N1, 16, 17);
  // serial fail?
  // while(!tofSerial)
  
  sendSerial(0x55);
  sendSerial(0xAA);
  sendSerial(TOFM_CMD_ST_MM);
  sendSerial(0x00);
  sendSerial(0xFA);

  if(readSerial() != 0x55) return -1;
  if(readSerial() != 0xAA) return -1;
  if(readSerial() != TOFM_CMD_ST_MM) return -1;
  if(readSerial() != 0x03) return -1;
  int distHi = readSerial();
  int distLo = readSerial();
  rangeStatus = readSerial();
  if(readSerial() != 0xFA) return -1;

  return distHi * 256 + distLo;
}

void gotoSleep() {
  Serial.println("Start sleeping");
  LoRa.end();
  if(wakeup_reason != ESP_SLEEP_WAKEUP_EXT0){
    expectWakeupTime = esp_timer_get_time() + sleepTime;
    esp_sleep_enable_timer_wakeup(sleepTime);
  }
  else{
    esp_sleep_enable_timer_wakeup(expectWakeupTime - esp_timer_get_time());
  }
  rtc_gpio_pulldown_en((gpio_num_t)helpPin);
  esp_sleep_enable_ext0_wakeup((gpio_num_t)helpPin, RISING);
  Serial.flush();
  // Finally set ESP32 into sleep
  esp_deep_sleep_start();
}

void setup() {
  // disabling WiFi
  adc_power_off();
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  // disabling bt
  btStop();
  // save energy
  setCpuFrequencyMhz(40);
  
  Serial.begin(115200);

  for(int i = 0; i < 6; ++i)
    MAC[i] = (ESP.getEfuseMac() >> ((5-i)*8) & 0xff);
//  Serial.printf("%02X:%02X:%02X:%02X:%02X:%02X\n", MAC[0],MAC[1],MAC[2],MAC[3],MAC[4],MAC[5]);
  id = String(MAC[0], HEX) + ":" + String(MAC[1], HEX) + ":" + String(MAC[2], HEX) + ":" + String(MAC[3], HEX) + ":" + String(MAC[4], HEX) + ":" + String(MAC[5], HEX);

  LoRa.setPins(csPin, resetPin, irqPin); // set CS, reset, IRQ pin
  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }

  // check wakeup reason
  wakeup_reason = esp_sleep_get_wakeup_cause();
  print_wakeup_reason(wakeup_reason);

  if (wakeup_reason == ESP_SLEEP_WAKEUP_TIMER){
    // Timer wakeup, ready to measure and send message
    Serial.println("Timer wakeup");
    doc["messageType"] = 0;
    doc["water"] = Ranging();
    doc["electricity"] = -1;
    doc["ToFStatus"] = rangeStatus;
    doc["senderId"] = id;
    doc["battery"] = 50;
    JsonArray path = doc.createNestedArray("path");
    path.add(id);

    String msg;
    serializeJson(doc, msg);
    Serial.println("Msg: " + msg);

    // send
    LoRa.beginPacket();
    LoRa.print(msg);
    LoRa.endPacket();
  }
  else if(wakeup_reason == ESP_SLEEP_WAKEUP_EXT0){
    Serial.println("Help triggered");
    doc["messageType"] = 2;
    doc["water"] = -1;
    doc["electricity"] = -1;
    doc["ToFStatus"] = -1;
    doc["senderId"] = id;
    doc["battery"] = 50;
    JsonArray path = doc.createNestedArray("path");
    path.add(id);

    String msg;
    serializeJson(doc, msg);
    Serial.println("Msg: " + msg);

    // send
    LoRa.beginPacket();
    LoRa.print(msg);
    LoRa.endPacket();

    // non-stop sending help message until callback
  }

  // wait for chaining signals
  // TODO

  gotoSleep();
}

void loop() {
  // not calling this part
}
