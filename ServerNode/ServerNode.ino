#include <WiFi.h>
#include <LoRa.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "MakerSpace_2.4G";
const char* password = "ntueesaad";
const char* serverName = "https://iot-term-project-server.onrender.com/messages";

const int csPin = 5;
const int resetPin = 2;
const int irqPin = 4;

StaticJsonDocument<500> doc;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  LoRa.setPins(csPin, resetPin, irqPin);// set CS, reset, IRQ pin
  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
//  LoRa.onReceive(onReceive);
  LoRa.receive();
}

void loop() {
  // put your main code here, to run repeatedly:
  int packetSize = LoRa.parsePacket();
  if (packetSize) {

//    char packet[packetSize] = {0};
    String packet;
    // read packet
    for (int i = 0; i < packetSize; i++) {
//      packet[i] = (char)LoRa.read();
      packet += (char)LoRa.read();
    }
    DeserializationError error = deserializeJson(doc, packet);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
    }
    else{
      serializeJsonPretty(doc, Serial);

      if(WiFi.status()== WL_CONNECTED){
        WiFiClient client;
        HTTPClient http;
      
        // Your Domain name with URL path or IP address with path
        http.begin(client, serverName);
        
        // If you need an HTTP request with a content type: application/json, use the following:
        http.addHeader("Content-Type", "application/json");
    
        int httpResponseCode = http.POST(packet);
      
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
          
        // Free resources
        http.end();
      }
      else {
        Serial.println("WiFi Disconnected");
      } 
    }
  }
}
